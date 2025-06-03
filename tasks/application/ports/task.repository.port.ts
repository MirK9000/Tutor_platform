// src/tasks/application/ports/task.repository.port.ts
import { Task } from '../../domain/models/task.model';
import { TaskAttachment } from '../../domain/models/task-attachment.model'; // Если CreateTaskData/UpdateTaskData будут содержать детали вложений

/**
 * Данные, необходимые для создания новой задачи в хранилище.
 * Исключаем 'id', так как он обычно генерируется хранилищем или непосредственно перед сохранением.
 * Исключаем методы, так как в хранилище передаются только данные.
 * Свойство attachments доменной модели Task здесь не используется напрямую,
 * так как создание TaskAttachmentEntity может быть связано с TaskEntity через ForeignKey,
 * и конкретные данные для TaskAttachmentEntity могут передаваться отдельно или быть частью этого DTO.
 * Для простоты, предположим, что данные для вложений (если они создаются одновременно с задачей)
 * будут частью этого объекта.
 */
export type CreateTaskData = Omit<Task, 'id' | 'calculateMaxPoints' | 'addAttachment' | 'removeAttachment' | 'updateDetails' | 'attachments'> & {
    maxPointsOverride?: number | null; // Убедимся, что это поле есть, если оно часть Task и не в Omit
};

export type UpdateTaskData = Partial<Omit<Task, 'id' | 'calculateMaxPoints' | 'addAttachment' | 'removeAttachment' | 'updateDetails' | 'attachments'>> & {
     maxPointsOverride?: number | null; // Убедимся, что это поле есть, если оно часть Task и не в Omit
};


export interface ITaskRepository {
    /**
     * Создает новую задачу в хранилище.
     * @param taskData - Данные для создания задачи.
     * @returns Промис, который разрешается созданной доменной моделью Task (уже с присвоенным id).
     */
    create(taskData: CreateTaskData): Promise<Task>;

    /**
     * Находит задачу по ее уникальному идентификатору.
     * @param id - Уникальный идентификатор задачи.
     * @returns Промис, который разрешается доменной моделью Task, если найдена, иначе null.
     */
    findById(id: string): Promise<Task | null>;

    /**
     * Находит все задачи (можно добавить параметры для фильтрации и пагинации в будущем).
     * @returns Промис, который разрешается массивом доменных моделей Task.
     */
    findAll(): Promise<Task[]>;

    /**
     * Обновляет существующую задачу в хранилище.
     * @param id - Уникальный идентификатор обновляемой задачи.
     * @param taskData - Данные для обновления задачи. Только те поля, которые нужно обновить.
     * @returns Промис, который разрешается обновленной доменной моделью Task, если найдена и обновлена, иначе null.
     */
    update(id: string, taskData: UpdateTaskData): Promise<Task | null>;

    /**
     * Удаляет задачу по ее уникальному идентификатору.
     * @param id - Уникальный идентификатор задачи для удаления.
     * @returns Промис, который разрешается булевым значением: true, если удаление прошло успешно, false - в противном случае.
     */
    deleteById(id: string): Promise<boolean>;
}

export const TASK_REPOSITORY_PORT = Symbol('ITaskRepository');