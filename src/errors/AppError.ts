export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  UNSUPPORTED_FILE_TYPE = 'UNSUPPORTED_FILE_TYPE',
  TEXT_EXTRACTION_FAILED = 'TEXT_EXTRACTION_FAILED',
  AI_ANALYSIS_FAILED = 'AI_ANALYSIS_FAILED',
  STORAGE_UPLOAD_FAILED = 'STORAGE_UPLOAD_FAILED',
  DB_WRITE_FAILED = 'DB_WRITE_FAILED',
  CAPTCHA_FAILED = 'CAPTCHA_FAILED',
  NOT_FOUND = 'NOT_FOUND',
}

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}
