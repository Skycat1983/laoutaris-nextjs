import { NextResponse } from "next/server";
import type { ApiErrorResponse } from "@/lib/data/types/apiTypes";

type AdminReadResource =
  | "article"
  | "artwork"
  | "blog"
  | "collection"
  | "comment"
  | "user";

type AdminReadFieldErrors = {
  id?: string[];
};

type AdminReadValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: AdminReadFieldErrors;
  formErrors: string[];
};

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const isValidObjectIdParam = (id: string) => objectIdPattern.test(id);

export const adminReadInvalidIdResponse = (
  resource: AdminReadResource,
  message: string
) =>
  NextResponse.json<AdminReadValidationErrorResponse>(
    {
      success: false,
      error: `Invalid ${resource} input`,
      fieldErrors: {
        id: [message],
      },
      formErrors: [],
    },
    { status: 400 }
  );
