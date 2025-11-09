import { BaseError } from "@/errors/base.error";
import { ERROR_CODES, HTTP_STATUS } from "@/shared/constants";

export class BadRequestError extends BaseError {
  constructor(message: string, details?: any) {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST, details);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string, details?: any) {
    super(
      message,
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.USER_ALREADY_EXISTS,
      details,
    );
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string, details?: any) {
    super(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN, details);
  }
}

export class InternalServerError extends BaseError {
  constructor(message: string, details?: any) {
    super(
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

export class NotFoundException extends BaseError {
  constructor(message: string, details?: any) {
    super(message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, details);
  }
}

export class UnauthorizedException extends BaseError {
  constructor(message: string, details?: any) {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, details);
  }
}
