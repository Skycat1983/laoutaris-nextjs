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

// Base API response type - can be either success with data or error
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Extends ApiSuccessResponse to always include metadata - used for paginated lists
type PaginatedResponse<T> = ApiSuccessResponse<T> & {
  metadata: PaginationMetadata;
};

// Utility type for fields that might be populated with full objects or remain as string IDs
type PopulatedField<T> = string | T | Partial<T>;

// Specific response types for different endpoints
// type BlogListResponse = ApiResponse<FrontendBlogEntry[]>; // Blog list endpoint - can be success with blog array or error
// type CollectionListResponse = ApiResponse<FrontendCollection[]>; // Collection list endpoint - can be success with collection array or error
// type SingleCollectionResponse = ApiResponse<FrontendCollection>; // Single collection endpoint - can be success with one collection or error
