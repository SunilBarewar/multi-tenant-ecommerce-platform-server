import { BaseError } from "@/errors/base.error";
import { ERROR_CODES } from "@/shared/constants/error-codes.const";
import { HTTP_STATUS } from "@/shared/constants/http-status.const";

export class InvalidCredentialsError extends BaseError {
  constructor(message = "Invalid credentials") {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.INVALID_CREDENTIALS);
  }
}

export class InvalidTokenError extends BaseError {
  constructor(message = "Invalid token") {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.TOKEN_INVALID);
  }
}

export class TokenExpiredError extends BaseError {
  constructor(message = "Token has expired") {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.TOKEN_EXPIRED);
  }
}
