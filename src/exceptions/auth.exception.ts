import { ERROR_CODES } from "@/shared/constants/error-codes.const";
import { HTTP_STATUS } from "@/shared/constants/http-status.const";

import { BaseException } from "./base.exception";

export class InvalidCredentialsException extends BaseException {
  constructor(message = "Invalid credentials") {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.INVALID_CREDENTIALS);
  }
}

export class InvalidTokenException extends BaseException {
  constructor(message = "Invalid token") {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.TOKEN_INVALID);
  }
}

export class TokenExpiredException extends BaseException {
  constructor(message = "Token has expired") {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.TOKEN_EXPIRED);
  }
}
