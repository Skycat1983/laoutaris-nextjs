import { z } from "zod";
import {
  ARTSTYLE_OPTIONS,
  DECADE_OPTIONS,
  FILTER_MODE_OPTIONS,
  MEDIUM_OPTIONS,
  SORT_OPTION_OPTIONS,
  SURFACE_OPTIONS,
} from "@/lib/constants/artworkConstants";

export const ARTWORK_LIST_QUERY_LIMITS = {
  defaultPage: 1,
  maxPage: 1000,
  defaultLimit: 10,
  maxLimit: 50,
} as const;

type ArtworkListQueryParam = string | string[] | null | undefined;

export type ArtworkListQueryInput = {
  filterMode?: ArtworkListQueryParam;
  sortBy?: ArtworkListQueryParam;
  sortColor?: ArtworkListQueryParam;
  page?: ArtworkListQueryParam;
  limit?: ArtworkListQueryParam;
  decade?: ArtworkListQueryParam;
  artstyle?: ArtworkListQueryParam;
  medium?: ArtworkListQueryParam;
  surface?: ArtworkListQueryParam;
};

const firstParamValue = (value: string | string[] | null | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? undefined;

const paramValues = (value: ArtworkListQueryParam) => {
  if (value == null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

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
  );

const optionalEnumParam = <T extends readonly [string, ...string[]]>(
  values: T,
  message: string,
  defaultValue?: T[number]
) =>
  z.preprocess(
    optionalParamValue,
    defaultValue
      ? z.enum(values, { errorMap: () => ({ message }) }).default(defaultValue)
      : z.enum(values, { errorMap: () => ({ message }) }).optional()
  );

const enumArrayParam = <T extends readonly [string, ...string[]]>(
  values: T,
  message: string
) =>
  z.array(z.enum(values, { errorMap: () => ({ message }) })).default([]);

export const artworkListQuerySchema = z.object({
  filterMode: optionalEnumParam(
    FILTER_MODE_OPTIONS,
    "Filter mode must be ALL or ANY",
    "ALL"
  ),
  sortBy: optionalEnumParam(
    SORT_OPTION_OPTIONS,
    "Sort option must be colorProximity, mostRecent, mostPopular, or mostFeatured",
    "mostRecent"
  ),
  sortColor: z
    .preprocess(
      optionalParamValue,
      z
        .string()
        .regex(
          /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
          "Sort color must be a valid hex color"
        )
        .optional()
    ),
  page: boundedIntegerParam(
    "Page",
    ARTWORK_LIST_QUERY_LIMITS.defaultPage,
    ARTWORK_LIST_QUERY_LIMITS.maxPage
  ),
  limit: boundedIntegerParam(
    "Limit",
    ARTWORK_LIST_QUERY_LIMITS.defaultLimit,
    ARTWORK_LIST_QUERY_LIMITS.maxLimit
  ),
  decade: enumArrayParam(DECADE_OPTIONS, "Decade filter contains an invalid value"),
  artstyle: enumArrayParam(
    ARTSTYLE_OPTIONS,
    "Art style filter contains an invalid value"
  ),
  medium: enumArrayParam(MEDIUM_OPTIONS, "Medium filter contains an invalid value"),
  surface: enumArrayParam(
    SURFACE_OPTIONS,
    "Surface filter contains an invalid value"
  ),
});

export type ArtworkListQuery = z.infer<typeof artworkListQuerySchema>;
export type ArtworkListQueryFieldErrors = Partial<
  Record<keyof ArtworkListQuery, string[] | undefined>
>;

export const parseArtworkListQuery = (input: ArtworkListQueryInput) =>
  artworkListQuerySchema.safeParse({
    filterMode: firstParamValue(input.filterMode),
    sortBy: firstParamValue(input.sortBy),
    sortColor: firstParamValue(input.sortColor),
    page: firstParamValue(input.page),
    limit: firstParamValue(input.limit),
    decade: paramValues(input.decade),
    artstyle: paramValues(input.artstyle),
    medium: paramValues(input.medium),
    surface: paramValues(input.surface),
  });

export const searchParamsToArtworkListQueryInput = (
  searchParams: URLSearchParams
): ArtworkListQueryInput => ({
  filterMode: searchParams.get("filterMode"),
  sortBy: searchParams.get("sortBy"),
  sortColor: searchParams.get("sortColor"),
  page: searchParams.get("page"),
  limit: searchParams.get("limit"),
  decade: searchParams.getAll("decade"),
  artstyle: searchParams.getAll("artstyle"),
  medium: searchParams.getAll("medium"),
  surface: searchParams.getAll("surface"),
});
