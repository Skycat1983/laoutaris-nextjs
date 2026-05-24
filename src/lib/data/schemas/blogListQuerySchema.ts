import { z } from "zod";

export const BLOG_LIST_SORT_OPTIONS = [
  "latest",
  "oldest",
  "popular",
  "featured",
] as const;

export type BlogListSortBy = (typeof BLOG_LIST_SORT_OPTIONS)[number];

export const BLOG_LIST_QUERY_LIMITS = {
  defaultPage: 1,
  maxPage: 1000,
  defaultLimit: 10,
  maxLimit: 25,
} as const;

type BlogListQueryParam = string | string[] | null | undefined;

export type BlogListQueryInput = {
  sortby?: BlogListQueryParam;
  page?: BlogListQueryParam;
  limit?: BlogListQueryParam;
};

const firstParamValue = (value: BlogListQueryParam) =>
  (Array.isArray(value) ? value[0] : value) ?? undefined;

const optionalParamValue = (value: unknown) =>
  value == null || (typeof value === "string" && value.trim() === "")
    ? undefined
    : value;

const normalizeBoundedIntegerParam = (
  value: unknown,
  defaultValue: number,
  maxValue: number
) => {
  const normalizedValue = optionalParamValue(value);

  if (normalizedValue === undefined) {
    return defaultValue;
  }

  if (typeof normalizedValue === "number") {
    if (
      !Number.isFinite(normalizedValue) ||
      !Number.isInteger(normalizedValue) ||
      normalizedValue < 1
    ) {
      return defaultValue;
    }

    return Math.min(normalizedValue, maxValue);
  }

  if (typeof normalizedValue !== "string") {
    return defaultValue;
  }

  const trimmedValue = normalizedValue.trim();

  if (!/^\d+$/.test(trimmedValue)) {
    return defaultValue;
  }

  const parsedValue = Number(trimmedValue);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return defaultValue;
  }

  return Math.min(parsedValue, maxValue);
};

const boundedIntegerParam = (defaultValue: number, maxValue: number) =>
  z.preprocess(
    (value) => normalizeBoundedIntegerParam(value, defaultValue, maxValue),
    z.number().int().min(1).max(maxValue)
  );

export const blogPageListQuerySchema = z.object({
  sortby: z.preprocess(
    optionalParamValue,
    z.enum(BLOG_LIST_SORT_OPTIONS).optional().catch(undefined)
  ),
  page: boundedIntegerParam(
    BLOG_LIST_QUERY_LIMITS.defaultPage,
    BLOG_LIST_QUERY_LIMITS.maxPage
  ),
});

export const blogApiListQuerySchema = z.object({
  sortby: z.preprocess(
    optionalParamValue,
    z.enum(BLOG_LIST_SORT_OPTIONS, {
      errorMap: () => ({
        message: "Sort option must be latest, oldest, popular, or featured",
      }),
    }).default("latest")
  ),
  page: boundedIntegerParam(
    BLOG_LIST_QUERY_LIMITS.defaultPage,
    BLOG_LIST_QUERY_LIMITS.maxPage
  ),
  limit: boundedIntegerParam(
    BLOG_LIST_QUERY_LIMITS.defaultLimit,
    BLOG_LIST_QUERY_LIMITS.maxLimit
  ),
});

export type BlogPageListQuery = z.infer<typeof blogPageListQuerySchema>;
export type BlogApiListQuery = z.infer<typeof blogApiListQuerySchema>;

export const parseBlogPageListQuery = (input: BlogListQueryInput) =>
  blogPageListQuerySchema.parse({
    sortby: firstParamValue(input.sortby),
    page: firstParamValue(input.page),
  });

export const parseBlogApiListQuery = (input: BlogListQueryInput) =>
  blogApiListQuerySchema.safeParse({
    sortby: firstParamValue(input.sortby),
    page: firstParamValue(input.page),
    limit: firstParamValue(input.limit),
  });

export const searchParamsToBlogListQueryInput = (
  searchParams: URLSearchParams
): BlogListQueryInput => ({
  sortby: searchParams.get("sortby"),
  page: searchParams.get("page"),
  limit: searchParams.get("limit"),
});

export const isBlogListSortBy = (sortby: string): sortby is BlogListSortBy =>
  BLOG_LIST_SORT_OPTIONS.includes(sortby as BlogListSortBy);
