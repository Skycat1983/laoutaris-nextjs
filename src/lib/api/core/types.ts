// Base API Response types (you probably already have these)
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Fetcher types
export type Fetcher = <T>(
  endpoint: string,
  options?: RequestInit
) => Promise<ApiResponse<T>>;

export type FetcherConfig = {
  getUrl: (path: string) => string;
  getHeaders: () => HeadersInit;
};
