/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from "express";

import { BaseException } from "@/exceptions";
import { logger } from "@/lib/logger";
import { ERROR_CODES } from "@/shared/constants/error-codes.const";
import { HTTP_STATUS } from "@/shared/constants/http-status.const";
import { ResponseFormatter } from "@/utils/formatters/response.formatter";

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(`Error: ${error.message}`, { stack: error.stack });

  if (error instanceof BaseException) {
    return ResponseFormatter.error(res, {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    });
  }

  // Handle unexpected errors
  return ResponseFormatter.error(res, {
    message: "An unexpected error occurred",
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  });
}
