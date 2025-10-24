import type { Nullable } from "@/shared/types";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: Nullable<T>;
  error?: ErrorDetails;
}

export interface ErrorDetails {
  code: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    previousPage: Nullable<number>;
    nextPage: Nullable<number>;
  };
}
