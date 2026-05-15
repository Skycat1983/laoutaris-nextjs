import { apiErrorResponse } from "./apiResponse";

type ApiAuthErrorStatus = 401 | 403 | 500;

export const apiAuthError = (
  error: string,
  status: ApiAuthErrorStatus
): ReturnType<typeof apiErrorResponse> =>
  apiErrorResponse({
    message: error,
    error,
    status,
  });
