// src/tasks/application/dto/task.dto.ts
import { TaskAttachment } from '../../domain/models/task-attachment.model'; // Импортируем доменную модель вложения

/**
 * DTO для представления задачи клиенту.
 * Включает вычисляемые поля, такие как maxPoints.
 */
export class TaskDto {
    public readonly id: string;
    public readonly description: string;
    public readonly answerSchema: any;
    public readonly theme: string;
    public readonly type: string;
    public readonly difficulty: number;
    public readonly attachments: TaskAttachment[]; // Используем доменную модель или создаем AttachmentDto
    public readonly maxPoints: number; // Это поле будет вычислено
    public readonly numberEGE?: number;
    public readonly maxPointsOverride?: number | null;

    constructor(
        id: string,
        description: string,
        answerSchema: any,
        theme: string,
        type: string,
        difficulty: number,
        attachments: TaskAttachment[],
        maxPoints: number,
        numberEGE?: number,
        maxPointsOverride?: number | null,
    ) {
        this.id = id;
        this.description = description;
        this.answerSchema = answerSchema;
        this.theme = theme;
        this.type = type;
        this.difficulty = difficulty;
        this.attachments = attachments; // Можно мапить TaskAttachment в AttachmentDto, если нужно скрыть детали доменной модели
        this.maxPoints = maxPoints;
        this.numberEGE = numberEGE;
        this.maxPointsOverride = maxPointsOverride;
    }
}