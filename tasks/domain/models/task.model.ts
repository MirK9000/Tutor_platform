// src/tasks/domain/models/task.model.ts
import { TaskAttachment } from './task-attachment.model'; // Предполагается, что task-attachment.model.ts уже создан и находится в той же директории

export class Task {
    public id: string; // Уникальный идентификатор задачи
    public description: string; // Описание/условие задачи
    public answerSchema: any; // JSON-схема для структуры правильного ответа и его проверки
    public theme: string; // Тема задачи (например, "Алгебра логики", "Динамическое программирование")
    public type: string; // Тип задачи (например, "single-choice", "text-input", "programming")
    public difficulty: number; // Уровень сложности (например, от 1 до 10)
    
    public attachments: TaskAttachment[]; // Массив вложений к задаче

    // Опциональные свойства
    public numberEGE?: number; // Номер задания в структуре ЕГЭ (если применимо)
    
    /**
     * Переопределенное максимальное количество баллов.
     * Может быть числом (конкретное значение), 
     * null (явное указание на "нет переопределения" или "использовать дефолт, рассчитанный из answerSchema"),
     * или undefined (если свойство не было задано при создании/обновлении, что также может означать "использовать дефолт").
     */
    public maxPointsOverride?: number | null;

    constructor(
        id: string,
        description: string,
        answerSchema: any,
        theme: string,
        type: string,
        difficulty: number,
        attachments: TaskAttachment[] = [], // Значение по умолчанию - пустой массив
        numberEGE?: number,
        maxPointsOverride?: number | null, // Разрешаем null и undefined
    ) {
        // Валидация основных полей
        if (!id || id.trim() === '') {
            throw new Error('Task ID cannot be empty.'); 
        }
        if (!description || description.trim() === '') {
            throw new Error('Task description cannot be empty.');
        }
        // Дополнительные проверки можно добавить по необходимости (например, на answerSchema, theme, type)

        this.id = id;
        this.description = description;
        this.answerSchema = answerSchema;
        this.theme = theme;
        this.type = type;
        this.difficulty = difficulty;
        this.attachments = attachments;
        this.numberEGE = numberEGE;
        this.maxPointsOverride = maxPointsOverride;

        // Пример валидации для difficulty в конструкторе
        if (this.difficulty < 1 || this.difficulty > 10) { 
            console.warn(`Task difficulty for task ID ${this.id} is out of expected range (1-10): ${this.difficulty}. Consider clamping or throwing an error.`);
            // Например, можно установить значение по умолчанию или граничное значение:
            // this.difficulty = Math.max(1, Math.min(10, this.difficulty)); 
        }
    }

    /**
     * Рассчитывает максимальное количество баллов за задачу.
     * Приоритет у явно переопределенного значения, затем у значения из answerSchema,
     * и в последнюю очередь - значение по умолчанию.
     * @returns {number} Максимальное количество баллов.
     */
    public calculateMaxPoints(): number {
        if (this.maxPointsOverride !== undefined && this.maxPointsOverride !== null) {
            return this.maxPointsOverride;
        }
        if (this.answerSchema && typeof this.answerSchema.maxScore === 'number') {
            return this.answerSchema.maxScore;
        }
        return 1; // Значение по умолчанию, если не удалось определить иначе
    }

    /**
     * Добавляет вложение к задаче.
     * @param {TaskAttachment} attachment - Объект вложения.
     */
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

    /**
     * Удаляет вложение из задачи по его ключу.
     * @param {string} attachmentKey - Ключ вложения, которое нужно удалить.
     */
    public removeAttachment(attachmentKey: string): void {
        if (!attachmentKey || attachmentKey.trim() === '') {
            console.warn(`Cannot remove attachment with an empty or invalid key for task ID ${this.id}.`);
            return;
        }
        this.attachments = this.attachments.filter(att => att.key !== attachmentKey);
    }

    /**
     * Обновляет детали задачи.
     * Принимает объект с полями, которые нужно обновить.
     * @param {Partial<Pick<Task, 'description' | 'answerSchema' | 'theme' | 'type' | 'difficulty' | 'numberEGE' | 'maxPointsOverride'>>} details - Детали для обновления.
     */
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
        // Корректная обработка maxPointsOverride, позволяющая установить его в null
        if (Object.prototype.hasOwnProperty.call(details, 'maxPointsOverride')) { 
            this.maxPointsOverride = details.maxPointsOverride;
        }
    }
}