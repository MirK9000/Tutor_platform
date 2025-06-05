// src/tasks/application/dto/create-task.dto.ts

/**
 * DTO для создания новой задачи.
 * Содержит данные, необходимые для инициализации доменной модели Task.
 * Свойства помечены как readonly, так как DTO не должны изменяться после создания.
 */
export class CreateTaskDto {
    public readonly description: string;
    public readonly answerSchema: any; // Схема ответа, может быть сложным объектом
    public readonly theme: string;
    public readonly type: string;
    public readonly difficulty: number;
    public readonly numberEGE?: number; // Номер задания ЕГЭ, опционально
    // public readonly attachments?: any[]; // Вложения обычно обрабатываются отдельно (например, загрузка файлов),
                                        // поэтому здесь может и не быть. Если передаются сразу, то нужно определить их структуру.
}