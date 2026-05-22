import { z } from "zod";
import type { SearchableContentType } from "@/lib/data/types/searchTypes";

export const SEARCH_CONTENT_TYPES = [
  "articles",
  "blogs",
  "collections",
  "artworks",
  "shop-products",
] as const satisfies readonly SearchableContentType[];

export const SEARCH_QUERY_LIMITS = {
  queryMaxLength: 120,
  defaultPage: 1,
  maxPage: 1000,
  defaultLimit: 10,
  maxLimit: 25,
} as const;

export type SearchQueryInput = {
  q?: string | string[] | null;
  type?: string | string[] | null;
  page?: string | string[] | null;
  limit?: string | string[] | null;
};

const firstParamValue = (value: string | string[] | null | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? undefined;

const optionalParamValue = (value: unknown) =>
  value == null || (typeof value === "string" && value.trim() === "")
    ? undefined
    : value;

const boundedIntegerParam = (
  fieldName: string,
  defaultValue: number,
  maxValue: number
) =>
  z.preprocess(
    (value) => optionalParamValue(value) ?? defaultValue,
    z.coerce
      .number({
        invalid_type_error: `${fieldName} must be a number`,
      })
      .int(`${fieldName} must be an integer`)
      .min(1, `${fieldName} must be at least 1`)
      .max(maxValue, `${fieldName} must be ${maxValue} or less`)
      .default(defaultValue)
  );

export const publicSearchQuerySchema = z.object({
  q: z
    .string({
      required_error: "Search query is required",
      invalid_type_error: "Search query must be a string",
    })
    .trim()
    .min(1, "Search query is required")
    .max(
      SEARCH_QUERY_LIMITS.queryMaxLength,
      `Search query must be ${SEARCH_QUERY_LIMITS.queryMaxLength} characters or fewer`
    ),
  type: z
    .preprocess(
      optionalParamValue,
      z.enum(SEARCH_CONTENT_TYPES, {
        errorMap: () => ({
          message:
            "Search type must be articles, blogs, collections, artworks, or shop-products",
        }),
      }).optional()
    ),
  page: boundedIntegerParam(
    "Page",
    SEARCH_QUERY_LIMITS.defaultPage,
    SEARCH_QUERY_LIMITS.maxPage
  ),
  limit: boundedIntegerParam(
    "Limit",
    SEARCH_QUERY_LIMITS.defaultLimit,
    SEARCH_QUERY_LIMITS.maxLimit
  ),
});

export type PublicSearchQuery = z.infer<typeof publicSearchQuerySchema>;
export type PublicSearchQueryFieldErrors = Partial<
  Record<keyof PublicSearchQuery, string[] | undefined>
>;

export const parsePublicSearchQuery = (input: SearchQueryInput) =>
  publicSearchQuerySchema.safeParse({
    q: firstParamValue(input.q),
    type: firstParamValue(input.type),
    page: firstParamValue(input.page),
    limit: firstParamValue(input.limit),
  });

export const searchParamsToSearchQueryInput = (
  searchParams: URLSearchParams
): SearchQueryInput => ({
  q: searchParams.get("q"),
  type: searchParams.get("type"),
  page: searchParams.get("page"),
  limit: searchParams.get("limit"),
});
