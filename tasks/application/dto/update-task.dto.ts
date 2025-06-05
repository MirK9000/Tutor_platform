// src/tasks/application/dto/update-task.dto.ts

/**
 * DTO для обновления существующей задачи.
 * Все свойства опциональны, так как клиент может захотеть обновить только часть данных.
 */
export class UpdateTaskDto {
    public readonly description?: string;
    public readonly answerSchema?: any;
    public readonly theme?: string;
    public readonly type?: string;
    public readonly difficulty?: number;
    public readonly numberEGE?: number;
    public readonly maxPointsOverride?: number | null; // Позволяет установить или сбросить переопределение
    // Информация об обновлении вложений (например, список ключей для добавления/удаления)
    // также может обрабатываться здесь или через отдельные эндпоинты.
}