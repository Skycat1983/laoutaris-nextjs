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

// Extends ApiSuccessResponse to always include metadata - used for paginated lists
export type PaginatedResponse<T> = ApiSuccessResponse<T> & {
  metadata: PaginationMetadata;
};

export interface SingleResult<T> extends ApiSuccessResponse<T> {
  metadata?: never;
}

export interface ListResult<T> extends ApiSuccessResponse<T[]> {
  metadata: Required<PaginationMetadata>;
}

// What routes return (with NextResponse)
export type RouteResponse<T> = NextResponse<T | ApiErrorResponse>;

// What fetchers return (raw data)
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// What components receive (raw data)
export type FetchResult<T> = ApiSuccessResponse<T> | ApiErrorResponse;
