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
// interface ApiRouteResponse<T> {
//   success: boolean;
//   data?: T;
//   errorCode?: number;
//   message?: string;
// }
