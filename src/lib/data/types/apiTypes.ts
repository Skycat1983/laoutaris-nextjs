import { NextResponse } from "next/server";

export interface BaseApiResponse {
  success: boolean;
  message?: string;
  statusCode?: number;
}

export type ApiErrorResponse = BaseApiResponse & {
  success: false;
  error: string;
  errorCode?: number;
};

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export type ApiSuccessResponse<T> = BaseApiResponse & {
  success: true;
  data: T;
  metadata?: PaginationMetadata;
};

export type SingleResult<T> = Omit<ApiSuccessResponse<T>, "metadata">;

export type ListResult<T> = ApiSuccessResponse<T[]> & {
  data: T[];
  metadata: Required<PaginationMetadata>;
};

export type PaginatedResponse<T> = ApiSuccessResponse<T> & {
  metadata: PaginationMetadata;
};

// What routes return (with NextResponse)
export type RouteResponse<T> = NextResponse<T | ApiErrorResponse>;

// What fetchers return (raw data)
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// What components receive (raw data)
export type FetchResult<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// export interface ApiSuccessResponse<T> extends BaseApiResponse {
//   success: true;
//   data: T;
//   metadata?: PaginationMetadata;
// }

// export interface SingleResult<T> extends ApiSuccessResponse<T> {
//   metadata?: never;
// }

// export interface ListResult<T> extends ApiSuccessResponse<T[]> {
//   metadata: Required<PaginationMetadata>;
// }
// export interface ApiErrorResponse extends BaseApiResponse {
//   success: false;
//   error: string;
//   errorCode?: number;
// }
