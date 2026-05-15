import { NextResponse } from "next/server";
import type { ApiErrorResponse } from "@/lib/data/types/apiTypes";

type AdminDeleteResource =
  | "article"
  | "artwork"
  | "blog"
  | "collection"
  | "comment"
  | "user";

type AdminDeleteFieldErrors = {
  id?: string[];
};

type AdminDeleteValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: AdminDeleteFieldErrors;
  formErrors: string[];
};

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const isValidObjectIdParam = (id: string) => objectIdPattern.test(id);

export const adminDeleteInvalidIdResponse = (
  resource: AdminDeleteResource,
  message: string
) =>
  NextResponse.json<AdminDeleteValidationErrorResponse>(
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
