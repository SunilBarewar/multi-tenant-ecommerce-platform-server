import { ERROR_CODES } from "@/shared/constants/error-codes.const";
import { HTTP_STATUS } from "@/shared/constants/http-status.const";

import { BaseException } from "./base.exception";

export class ValidationException extends BaseException {
  constructor(message: string, details?: any) {
    super(
      message,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      ERROR_CODES.VALIDATION_ERROR,
      details,
    );
  }
}
