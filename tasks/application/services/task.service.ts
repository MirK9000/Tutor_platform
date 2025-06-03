// src/tasks/application/services/task.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../../domain/models/task.model';
// TaskAttachment не используется напрямую здесь, но TaskDto (используемый в mapTaskToDto) его импортирует
import { ITaskRepository, TASK_REPOSITORY_PORT, CreateTaskData, UpdateTaskData } from '../ports/task.repository.port';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskDto } from '../dto/task.dto';
import { v4 as uuidv4 } from 'uuid'; // Теперь эта строка не должна вызывать ошибку

@Injectable()
export class TaskService {
    constructor(
        @Inject(TASK_REPOSITORY_PORT)
        private readonly taskRepository: ITaskRepository,
    ) {}

    async createTask(createTaskDto: CreateTaskDto): Promise<TaskDto> {
        const taskId = uuidv4(); // ID генерируется здесь

        // Создаем данные для репозитория.
        // Тип CreateTaskData определяет, что ожидает репозиторий.
        // Он основан на Omit<Task, ...>, поэтому не должен содержать методы или исключенные поля.
        const dataForRepo: CreateTaskData = {
            description: createTaskDto.description,
            answerSchema: createTaskDto.answerSchema,
            theme: createTaskDto.theme,
            type: createTaskDto.type,
            difficulty: createTaskDto.difficulty,
            numberEGE: createTaskDto.numberEGE,
            // maxPointsOverride из CreateTaskDto не передается, т.к. его там нет.
            // Если бы в CreateTaskDto было поле maxPointsOverride, оно бы передавалось сюда.
            // Если Task-конструктор устанавливает для него какое-то значение по умолчанию,
            // и это значение нужно сохранить, то его нужно добавить в CreateTaskData
            // или обеспечить, чтобы репозиторий его правильно обработал.
            // В нашем случае, в CreateTaskDto нет maxPointsOverride,
            // а в Task-конструкторе он опционален.
            // Если в CreateTaskData (в порте) maxPointsOverride не определен, то и здесь его не будет.
            // Если он там определен как опциональный, то здесь можно передать undefined или значение из createTaskDto, если бы оно там было.
            // Давайте убедимся, что CreateTaskData в порте имеет maxPointsOverride (если он не исключен через Omit)
             maxPointsOverride: undefined, // Явно указываем, если он есть в CreateTaskData и не в CreateTaskDto
                                           // или createTaskDto.maxPointsOverride, если бы оно там было.
                                           // Если в Task он опционален и может быть undefined, это нормально.
        };
        
        // Вызываем метод репозитория.
        // Предполагается, что репозиторий либо использует ID, переданный через CreateTaskData (если бы он там был),
        // либо генерирует ID сам (например, на уровне БД), и возвращает Task с этим ID.
        // Так как текущий CreateTaskData не включает ID, ID должен быть присвоен на стороне репозитория/БД.
        const savedTask = await this.taskRepository.create(dataForRepo);

        // Маппим результат (который должен быть полноценной доменной моделью Task с ID) в DTO.
        return this.mapTaskToDto(savedTask);
    }

    async getTaskById(id: string): Promise<TaskDto | null> {
        const taskDomainModel = await this.taskRepository.findById(id);
        if (!taskDomainModel) {
            // Можно вернуть null или выбросить NotFoundException,
            // в зависимости от того, как сервис будет использоваться.
            // Если для API, то NotFoundException предпочтительнее.
            // Для "чистой" бизнес-логики - null.
            // return null; 
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return this.mapTaskToDto(taskDomainModel);
    }

    async getAllTasks(): Promise<TaskDto[]> {
        const tasksDomainModels = await this.taskRepository.findAll();
        return tasksDomainModels.map(task => this.mapTaskToDto(task));
    }

    async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskDto | null> {
        // Тип UpdateTaskData (из порта) должен быть совместим с updateTaskDto.
        // Если UpdateTaskDto имеет { maxPointsOverride?: number | null },
        // а UpdateTaskData (выведенный из Task) имеет { maxPointsOverride?: number | null | undefined },
        // то присвоение { ...updateTaskDto } будет корректным.
        const taskDataForRepo: UpdateTaskData = { ...updateTaskDto }; 
                                                // Эта строка больше не должна вызывать ошибку,
                                                // если Task.maxPointsOverride теперь number | null | undefined

        const updatedTaskDomainModel = await this.taskRepository.update(id, taskDataForRepo);

        if (!updatedTaskDomainModel) {
            // return null;
            throw new NotFoundException(`Task with ID ${id} not found for update or update failed`);
        }
        return this.mapTaskToDto(updatedTaskDomainModel);
    }

    async deleteTask(id: string): Promise<boolean> {
        // Можно сначала проверить, существует ли задача, чтобы вернуть более осмысленную ошибку или false.
        const deleted = await this.taskRepository.deleteById(id);
        if (!deleted) {
            // Можно логировать или выбросить ошибку, если удаление ожидалось, но не произошло.
            // throw new NotFoundException(`Task with ID ${id} not found or could not be deleted.`);
            return false; // или выбросить ошибку, если false не является ожидаемым успешным результатом
        }
        return true;
    }

    private mapTaskToDto(task: Task): TaskDto {
        if (!task || !task.id) { // Добавим проверку на случай, если из репозитория пришел некорректный объект
            throw new Error('Invalid task domain model received for DTO mapping.');
        }
        return new TaskDto(
            task.id,
            task.description,
            task.answerSchema,
            task.theme,
            task.type,
            task.difficulty,
            task.attachments, // Убедитесь, что task.attachments соответствует типу в TaskDto
            task.calculateMaxPoints(),
            task.numberEGE,
            task.maxPointsOverride
        );
    }
}