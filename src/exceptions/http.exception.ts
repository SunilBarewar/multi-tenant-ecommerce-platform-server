import { ERROR_CODES } from "@/shared/constants/error-codes.const";
import { HTTP_STATUS } from "@/shared/constants/http-status.const";

import { BaseException } from "./base.exception";

export class BadRequestException extends BaseException {
  constructor(message: string, details?: any) {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST, details);
  }
}

export class ConflictException extends BaseException {
  constructor(message: string, details?: any) {
    super(
      message,
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.USER_ALREADY_EXISTS,
      details,
    );
  }
}

export class ForbiddenException extends BaseException {
  constructor(message: string, details?: any) {
    super(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN, details);
  }
}

export class InternalServerException extends BaseException {
  constructor(message: string, details?: any) {
    super(
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

export class NotFoundException extends BaseException {
  constructor(message: string, details?: any) {
    super(message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, details);
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message: string, details?: any) {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, details);
  }
}
