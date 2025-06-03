// src/tasks/domain/models/task-attachment.model.ts

export class TaskAttachment {
  /**
   * Уникальный ключ (идентификатор) файла в системе хранения (например, S3 Object Key).
   * Используется для получения прямой ссылки на скачивание или отображение.
   */
  public readonly key: string;

  /**
   * Оригинальное имя файла, которое будет отображаться пользователю.
   * Например, "diagram.png", "task_conditions.pdf".
   */
  public readonly fileName: string;

  /**
   * MIME-тип файла, указывающий на его формат.
   * Например, "image/jpeg", "application/pdf", "text/plain".
   * Помогает браузеру правильно обработать файл.
   */
  public readonly mimeType: string;

  /**
   * Размер файла в байтах.
   * Может использоваться для отображения информации пользователю или для валидации.
   */
  public readonly sizeBytes: number;

  /**
   * Опционально: URL для прямого доступа к файлу.
   * Может генерироваться на лету сервисом вложений (AttachmentService)
   * или храниться, если ссылки долгоживущие (менее предпочтительно для S3).
   * Для "чистой" доменной модели это поле может быть избыточным,
   * так как URL-генерация — это скорее задача сервисного или инфраструктурного слоя.
   * Но для удобства его иногда включают. Если не используется, можно удалить.
   */
  public readonly url?: string; // Опционально

  constructor(
    key: string,
    fileName: string,
    mimeType: string,
    sizeBytes: number,
    url?: string, // Опционально
  ) {
    // Простая валидация для примера
    if (!key || key.trim() === '') {
      throw new Error('Attachment key cannot be empty.');
    }
    if (!fileName || fileName.trim() === '') {
      throw new Error('Attachment fileName cannot be empty.');
    }
    if (sizeBytes < 0) {
      throw new Error('Attachment sizeBytes cannot be negative.');
    }

    this.key = key;
    this.fileName = fileName;
    this.mimeType = mimeType;
    this.sizeBytes = sizeBytes;
    this.url = url;
  }

  // Можно добавить методы, если для вложения есть специфическое поведение
  // Например, форматирование размера файла для отображения:
  public getFormattedSize(): string {
    if (this.sizeBytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(this.sizeBytes) / Math.log(k));
    return parseFloat((this.sizeBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}