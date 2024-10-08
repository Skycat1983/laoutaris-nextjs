//! data fetching

interface BaseApiResponse {
  success: boolean;
  message?: string;
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
  defaultRedirect?: string;
  disabled?: boolean;
  // text: string;
}

interface ExtendedSubnavLink extends SubnavLink {
  defaultRedirect: string;
}
