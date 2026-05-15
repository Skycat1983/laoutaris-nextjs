import { z } from "zod";
import {
  ARTSTYLE_OPTIONS,
  DECADE_OPTIONS,
  MEDIUM_OPTIONS,
  SURFACE_OPTIONS,
} from "@/lib/constants/artworkConstants";
import { SHOP_SORT_OPTIONS } from "@/lib/data/types/shopTypes";

export type ShopProductListQueryInput = {
  sortBy?: string | string[] | null;
  showOriginals?: string | string[] | null;
  showPrints?: string | string[] | null;
  showBooks?: string | string[] | null;
  decade?: string[] | null;
  artstyle?: string[] | null;
  medium?: string[] | null;
  surface?: string[] | null;
};

const firstParamValue = (value: string | string[] | null | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? undefined;

const optionalParamValue = (value: unknown) =>
  value == null ? undefined : value;

const enumArrayParam = <T extends readonly [string, ...string[]]>(
  values: T,
  message: string
) =>
  z.array(z.enum(values, { errorMap: () => ({ message }) })).default([]);

const optionalBooleanStringParam = (fieldName: string) =>
  z
    .preprocess(
      optionalParamValue,
      z
        .enum(["true", "false"], {
          errorMap: () => ({ message: `${fieldName} must be true or false` }),
        })
        .default("true")
    )
    .transform((value) => value === "true");

export const shopProductListQuerySchema = z.object({
  sortBy: z.preprocess(
    optionalParamValue,
    z
      .enum(SHOP_SORT_OPTIONS, {
        errorMap: () => ({
          message:
            "Sort option must be type, price-low, price-high, title-asc, or title-desc",
        }),
      })
      .optional()
  ),
  showOriginals: optionalBooleanStringParam("showOriginals"),
  showPrints: optionalBooleanStringParam("showPrints"),
  showBooks: optionalBooleanStringParam("showBooks"),
  decade: enumArrayParam(
    DECADE_OPTIONS,
    "Decade filter contains an invalid value"
  ),
  artstyle: enumArrayParam(
    ARTSTYLE_OPTIONS,
    "Art style filter contains an invalid value"
  ),
  medium: enumArrayParam(
    MEDIUM_OPTIONS,
    "Medium filter contains an invalid value"
  ),
  surface: enumArrayParam(
    SURFACE_OPTIONS,
    "Surface filter contains an invalid value"
  ),
});

export type ShopProductListQuery = z.infer<typeof shopProductListQuerySchema>;
export type ShopProductListQueryFieldErrors = Partial<
  Record<keyof ShopProductListQuery, string[] | undefined>
>;

export const parseShopProductListQuery = (input: ShopProductListQueryInput) =>
  shopProductListQuerySchema.safeParse({
    sortBy: firstParamValue(input.sortBy),
    showOriginals: firstParamValue(input.showOriginals),
    showPrints: firstParamValue(input.showPrints),
    showBooks: firstParamValue(input.showBooks),
    decade: input.decade ?? [],
    artstyle: input.artstyle ?? [],
    medium: input.medium ?? [],
    surface: input.surface ?? [],
  });

export const searchParamsToShopProductListQueryInput = (
  searchParams: URLSearchParams
): ShopProductListQueryInput => ({
  sortBy: searchParams.get("sortBy"),
  showOriginals: searchParams.get("showOriginals"),
  showPrints: searchParams.get("showPrints"),
  showBooks: searchParams.get("showBooks"),
  decade: searchParams.getAll("decade"),
  artstyle: searchParams.getAll("artstyle"),
  medium: searchParams.getAll("medium"),
  surface: searchParams.getAll("surface"),
});
