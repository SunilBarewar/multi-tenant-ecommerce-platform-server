import { type Response } from "express";

import { HTTP_STATUS } from "@/shared/constants/http-status.const";
import {
  type ApiResponse,
  type PaginatedResponse,
} from "@/shared/interfaces/response.interface";

type ErrorResponseParams = {
  message: string;
  code: string;
  statusCode?: number;
  details?: any;
};

type PaginatedResponseParams<T> = {
  message: string;
  data: T[];
  page: number;
  limit: number;
  totalItems: number;
};

type SuccessResponseParams<T> = {
  message: string;
  data?: T;
  statusCode: number;
};

export class ResponseFormatter {
  static error(
    res: Response,
    {
      message,
      code,
      statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
      details,
    }: ErrorResponseParams,
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: {
        code,
        details,
      },
    };

    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    { message, data, page, limit, totalItems }: PaginatedResponseParams<T>,
  ): Response {
    const hasPreviousPage = page > 1;
    const hasNextPage = page * limit < totalItems;
    const previousPage = hasPreviousPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    const response: PaginatedResponse<T> = {
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        hasPreviousPage,
        hasNextPage,
        previousPage,
        nextPage,
      },
    };

    return res.status(HTTP_STATUS.OK).json(response);
  }

  static success<T>(
    res: Response,
    { message, data, statusCode = HTTP_STATUS.OK }: SuccessResponseParams<T>,
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data: data ?? undefined,
    };

    return res.status(statusCode).json(response);
  }
}
