//! Generic API Response Types
interface BaseApiResponse {
  success: boolean;
  message?: string;
  statusCode?: number;
}

interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

interface ApiSuccessResponse<T> extends BaseApiResponse {
  success: true;
  data: T;
  metadata?: PaginationMetadata;
}

interface ApiErrorResponse extends BaseApiResponse {
  success: false;
  error: string;
  errorCode?: number;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

type CollectionListResponse = ApiResponse<FrontendCollection[]>;
type SingleCollectionResponse = ApiResponse<FrontendCollection>;

type PaginatedResponse<T> = ApiSuccessResponse<T> & {
  metadata: PaginationMetadata;
};

type PaginatedCollectionResponse = PaginatedResponse<FrontendCollection[]>;
