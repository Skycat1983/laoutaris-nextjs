import { NextResponse } from "next/server";
import { ApiErrorResponse } from "@/lib/data/types/apiTypes";

type ApiAuthErrorStatus = 401 | 403 | 500;

export const apiAuthError = (
  error: string,
  status: ApiAuthErrorStatus
) =>
  NextResponse.json(
    {
      success: false,
      message: error,
      error,
    } satisfies ApiErrorResponse,
    { status }
  );
