//! data fetching

interface BaseApiResponse {
  success: boolean;
  message?: string;
  statusCode?: number;
}

interface ApiSuccessResponse<T> extends BaseApiResponse {
  success: true;
  data: T;
}

interface ApiErrorResponse extends BaseApiResponse {
  success: false;
  errorCode?: number;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

//! routes
interface SubnavLink {
  title: string;
  slug: string;
  disabled?: boolean;
}

interface ExtendedSubnavLink extends SubnavLink {
  defaultRedirect: string;
}
