// src/tasks/domain/models/task.model.ts
import { TaskAttachment } from './task-attachment.model';

export class Task {
    public id: string;
    public description: string;
    public answerSchema: any;
    public theme: string;
    public type: string;
    public difficulty: number;
    public attachments: TaskAttachment[];
    public numberEGE?: number;
    
    /**
     * Переопределенное максимальное количество баллов.
     * Может быть числом (конкретное значение), 
     * null (явное указание на "нет переопределения" или "использовать дефолт, рассчитанный из answerSchema"),
     * или undefined (если свойство не было задано).
     */
    public maxPointsOverride?: number | null; // <--- УБЕДИТЕСЬ, ЧТО ЗДЕСЬ ЕСТЬ "| null" И "?"

    constructor(
        id: string,
        description: string,
        answerSchema: any,
        theme: string,
        type: string,
        difficulty: number,
        attachments: TaskAttachment[] = [],
        numberEGE?: number,
        maxPointsOverride?: number | null, // <--- И ЗДЕСЬ В ПАРАМЕТРЕ КОНСТРУКТОРА "| null"
    ) {
        if (!id || id.trim() === '') {
            throw new Error('Task ID cannot be empty.'); 
        }
        if (!description || description.trim() === '') {
            throw new Error('Task description cannot be empty.');
        }

        this.id = id;
        this.description = description;
        this.answerSchema = answerSchema;
        this.theme = theme;
        this.type = type;
        this.difficulty = difficulty;
        this.attachments = attachments;
        this.numberEGE = numberEGE;
        this.maxPointsOverride = maxPointsOverride; // Присвоение

        if (this.difficulty < 1 || this.difficulty > 10) { 
            console.warn(`Task difficulty for task ID ${this.id} is out of expected range (1-10): ${this.difficulty}.`);
        }
    }

    public calculateMaxPoints(): number {
        if (this.maxPointsOverride !== undefined && this.maxPointsOverride !== null) {
            return this.maxPointsOverride;
        }
        if (this.answerSchema && typeof this.answerSchema.maxScore === 'number') {
            return this.answerSchema.maxScore;
        }
        return 1;
    }

    public addAttachment(attachment: TaskAttachment): void {
        if (!attachment) {
            console.error(`Cannot add null or undefined attachment to task ID ${this.id}.`);
            return;
        }
        if (this.attachments.some(att => att.key === attachment.key)) {
             console.warn(`Attachment with key ${attachment.key} already exists for task ID ${this.id}.`);
             return;
        }
        this.attachments.push(attachment);
    }

    public removeAttachment(attachmentKey: string): void {
        if (!attachmentKey || attachmentKey.trim() === '') {
            console.warn(`Cannot remove attachment with an empty or invalid key for task ID ${this.id}.`);
            return;
        }
        this.attachments = this.attachments.filter(att => att.key !== attachmentKey);
    }

    public updateDetails(details: Partial<Pick<Task, 'description' | 'answerSchema' | 'theme' | 'type' | 'difficulty' | 'numberEGE' | 'maxPointsOverride'>>): void {
        if (details.description !== undefined) {
            this.description = details.description;
        }
        if (details.answerSchema !== undefined) {
            this.answerSchema = details.answerSchema;
        }
        if (details.theme !== undefined) {
            this.theme = details.theme;
        }
        if (details.type !== undefined) {
            this.type = details.type;
        }
        if (details.difficulty !== undefined) {
            if (details.difficulty < 1 || details.difficulty > 10) {
                console.warn(`Attempt to set difficulty for task ID ${this.id} out of expected range (1-10): ${details.difficulty}. Value not updated.`);
            } else {
                this.difficulty = details.difficulty;
            }
        }
        if (details.numberEGE !== undefined) {
            this.numberEGE = details.numberEGE;
        }
        if (Object.prototype.hasOwnProperty.call(details, 'maxPointsOverride')) { 
            this.maxPointsOverride = details.maxPointsOverride; // Это присвоение теперь должно быть совместимо с number | null | undefined
        }
    }
}