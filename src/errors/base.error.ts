export class BaseError extends Error {
  public readonly code: string;

  public readonly details?: any;

  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    details?: any,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
