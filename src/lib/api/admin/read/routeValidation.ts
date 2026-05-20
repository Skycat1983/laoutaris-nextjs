import { NextResponse } from "next/server";
import type { ApiErrorResponse } from "@/lib/data/types/apiTypes";

export type AdminReadResource =
  | "article"
  | "artwork"
  | "blog"
  | "collection"
  | "comment"
  | "user";

type AdminReadFieldErrors = {
  id?: string[];
  page?: string[];
  limit?: string[];
  search?: string[];
};

type AdminReadValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: AdminReadFieldErrors;
  formErrors: string[];
};

type AdminReadPaginationOptions = {
  defaultLimit?: number;
  search?: {
    maxLength: number;
  };
};

type AdminReadPaginationResult =
  | {
      ok: true;
      page: number;
      limit: number;
      search?: string;
    }
  | {
      ok: false;
      response: NextResponse<AdminReadValidationErrorResponse>;
    };

type ParsedBoundedInteger =
  | {
      ok: true;
      value: number;
    }
  | {
      ok: false;
      error: string;
    };

type ParsedBoundedSearch =
  | {
      ok: true;
      value?: string;
    }
  | {
      ok: false;
      error: string;
    };

export const ADMIN_READ_LIST_QUERY_LIMITS = {
  defaultPage: 1,
  maxPage: 1000,
  defaultLimit: 10,
  maxLimit: 100,
} as const;

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const isValidObjectIdParam = (id: string) => objectIdPattern.test(id);

const adminReadValidationErrorResponse = (
  resource: AdminReadResource,
  fieldErrors: AdminReadFieldErrors,
  formErrors: string[] = []
) =>
  NextResponse.json<AdminReadValidationErrorResponse>(
    {
      success: false,
      error: `Invalid ${resource} input`,
      fieldErrors,
      formErrors,
    },
    { status: 400 }
  );

export const adminReadInvalidIdResponse = (
  resource: AdminReadResource,
  message: string
) =>
  adminReadValidationErrorResponse(resource, {
    id: [message],
  });

const parseBoundedIntegerParam = (
  rawValue: string | null,
  displayName: "Page" | "Limit",
  defaultValue: number,
  maxValue: number
): ParsedBoundedInteger => {
  if (rawValue === null || rawValue === "") {
    return {
      ok: true,
      value: defaultValue,
    };
  }

  if (!/^\d+$/.test(rawValue)) {
    return {
      ok: false,
      error: `${displayName} must be a positive integer`,
    };
  }

  const value = Number(rawValue);

  if (!Number.isSafeInteger(value)) {
    return {
      ok: false,
      error: `${displayName} must be ${maxValue} or less`,
    };
  }

  if (value < 1) {
    return {
      ok: false,
      error: `${displayName} must be at least 1`,
    };
  }

  if (value > maxValue) {
    return {
      ok: false,
      error: `${displayName} must be ${maxValue} or less`,
    };
  }

  return {
    ok: true,
    value,
  };
};

const parseBoundedSearchParam = (
  rawValue: string | null,
  maxLength: number
): ParsedBoundedSearch => {
  if (rawValue === null) {
    return {
      ok: true,
      value: undefined,
    };
  }

  const value = rawValue.trim();

  if (value.length === 0) {
    return {
      ok: true,
      value: undefined,
    };
  }

  if (value.length > maxLength) {
    return {
      ok: false,
      error: `Search must be ${maxLength} characters or fewer`,
    };
  }

  return {
    ok: true,
    value,
  };
};

export const parseAdminReadListQuery = (
  searchParams: URLSearchParams,
  resource: AdminReadResource,
  options: AdminReadPaginationOptions = {}
): AdminReadPaginationResult => {
  const limitDefault =
    options.defaultLimit ?? ADMIN_READ_LIST_QUERY_LIMITS.defaultLimit;
  const pageResult = parseBoundedIntegerParam(
    searchParams.get("page"),
    "Page",
    ADMIN_READ_LIST_QUERY_LIMITS.defaultPage,
    ADMIN_READ_LIST_QUERY_LIMITS.maxPage
  );
  const limitResult = parseBoundedIntegerParam(
    searchParams.get("limit"),
    "Limit",
    limitDefault,
    ADMIN_READ_LIST_QUERY_LIMITS.maxLimit
  );
  const searchResult = options.search
    ? parseBoundedSearchParam(
        searchParams.get("search"),
        options.search.maxLength
      )
    : ({
        ok: true,
        value: undefined,
      } as const);

  const fieldErrors: AdminReadFieldErrors = {};

  if (!pageResult.ok) {
    fieldErrors.page = [pageResult.error];
  }

  if (!limitResult.ok) {
    fieldErrors.limit = [limitResult.error];
  }

  if (!searchResult.ok) {
    fieldErrors.search = [searchResult.error];
  }

  if (!pageResult.ok || !limitResult.ok || !searchResult.ok) {
    return {
      ok: false,
      response: adminReadValidationErrorResponse(resource, fieldErrors),
    };
  }

  return {
    ok: true,
    page: pageResult.value,
    limit: limitResult.value,
    search: searchResult.value,
  };
};
