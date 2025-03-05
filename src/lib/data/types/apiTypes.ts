import { NextResponse } from "next/server";

export interface BaseApiResponse {
  success: boolean;
  message?: string;
  statusCode?: number;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export interface ApiSuccessResponse<T> extends BaseApiResponse {
  success: true;
  data: T;
  metadata?: PaginationMetadata;
}

export interface ApiErrorResponse extends BaseApiResponse {
  success: false;
  error: string;
  errorCode?: number;
}

// Base API response type - can be either success with data or error
// export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Extends ApiSuccessResponse to always include metadata - used for paginated lists
export type PaginatedResponse<T> = ApiSuccessResponse<T> & {
  metadata: PaginationMetadata;
};

export type SingleResponse<T> = ApiSuccessResponse<T>;

export type ListResponse<T> = ApiSuccessResponse<T[]> & {
  metadata: Required<PaginationMetadata>;
};

// Base result types
export type SingleResult<T> = {
  success: true;
  data: T;
};

export type ListResult<T> = {
  success: true;
  data: T[];
  metadata: Required<PaginationMetadata>;
};

// Response types for routes
export type ApiResponse<T> = NextResponse<T | ApiErrorResponse>;
