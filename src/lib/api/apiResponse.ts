import { NextResponse } from "next/server";
import type {
  ApiErrorResponse,
  ListResult,
  PaginationMetadata,
  SingleResult,
} from "@/lib/data/types/apiTypes";

type ApiErrorResponseOptions = {
  message: string;
  status: number;
  error?: string;
};

type ApiSuccessResponseOptions = ResponseInit & {
  message?: string;
};

export const apiErrorResponse = ({
  message,
  status,
  error = message,
}: ApiErrorResponseOptions): NextResponse<ApiErrorResponse> =>
  NextResponse.json(
    {
      success: false,
      message,
      error,
    } satisfies ApiErrorResponse,
    { status }
  );

export const apiSuccessResponse = <T>(
  data: T,
  init?: ApiSuccessResponseOptions
): NextResponse<SingleResult<T>> => {
  const { message, ...responseInit } = init ?? {};

  return NextResponse.json(
    {
      success: true,
      data,
      ...(message === undefined ? {} : { message }),
    } satisfies SingleResult<T>,
    responseInit
  );
};

export const apiListResponse = <T>(
  data: T[],
  metadata: Required<PaginationMetadata>,
  init?: ResponseInit
): NextResponse<ListResult<T>> =>
  NextResponse.json(
    {
      success: true,
      data,
      metadata,
    } satisfies ListResult<T>,
    init
  );
