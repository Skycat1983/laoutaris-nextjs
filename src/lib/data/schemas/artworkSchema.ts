import { z } from "zod";
import { cloudinaryImageSchema } from "./cloudinarySchema";
import {
  ARTSTYLE_OPTIONS,
  DECADE_OPTIONS,
  MEDIUM_OPTIONS,
  SURFACE_OPTIONS,
} from "@/lib/constants/artworkConstants";

const ARTWORK_FIELD_LIMITS = {
  title: 200,
} as const;

export const SHOPIFY_PRODUCT_TYPE_OPTIONS = [
  "original",
  "print",
  "book",
] as const;
const SHOPIFY_NUMERIC_PRODUCT_ID_PATTERN = /^\d+$/;

const objectIdStringSchema = (message: string) =>
  z
    .string({
      required_error: message,
      invalid_type_error: message,
    })
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, message);

const requiredTrimmedString = (fieldName: string) =>
  z
    .string({
      required_error: `${fieldName} is required`,
      invalid_type_error: `${fieldName} must be a string`,
    })
    .trim();

const shopifyProductLinkSchema = z
  .object({
    productId: z
      .string({
        required_error: "Shopify product ID is required",
        invalid_type_error: "Shopify product ID must be a string",
      })
      .trim()
      .regex(
        SHOPIFY_NUMERIC_PRODUCT_ID_PATTERN,
        "Shopify product ID must be numeric"
      ),
    type: z.enum(SHOPIFY_PRODUCT_TYPE_OPTIONS, {
      required_error: "Shopify product type is required",
      invalid_type_error: "Shopify product type is required",
    }),
  })
  .strict();

const shopifyProductsSchema = z
  .array(shopifyProductLinkSchema, {
    invalid_type_error: "Shopify products must be an array",
  })
  .superRefine((links, ctx) => {
    const seenProductIds = new Set<string>();

    links.forEach((link, index) => {
      if (seenProductIds.has(link.productId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Shopify product IDs must be unique within an artwork",
          path: [index, "productId"],
        });
        return;
      }

      seenProductIds.add(link.productId);
    });
  });

// Schema for form input data
export const artworkFormSchema = z.object({
  title: requiredTrimmedString("Title")
    .min(1, "Title is required")
    .max(
      ARTWORK_FIELD_LIMITS.title,
      `Title must be ${ARTWORK_FIELD_LIMITS.title} characters or fewer`
    ),
  decade: z.enum(DECADE_OPTIONS),
  artstyle: z.enum(ARTSTYLE_OPTIONS),
  medium: z.enum(MEDIUM_OPTIONS),
  surface: z.enum(SURFACE_OPTIONS),
  featured: z.boolean().default(false),
  shopifyProducts: shopifyProductsSchema.default([]),
});

export type ArtworkFormValues = z.infer<typeof artworkFormSchema>;

export const createArtworkSchema = artworkFormSchema.extend({
  image: cloudinaryImageSchema,
});

export type CreateArtworkFormValues = z.infer<typeof createArtworkSchema>;

const routeCloudinaryImageSchema = cloudinaryImageSchema.strict();

export const updateArtworkSchema = artworkFormSchema;

const artworkRouteFields = {
  title: artworkFormSchema.shape.title,
  decade: artworkFormSchema.shape.decade,
  artstyle: artworkFormSchema.shape.artstyle,
  medium: artworkFormSchema.shape.medium,
  surface: artworkFormSchema.shape.surface,
  featured: artworkFormSchema.shape.featured,
  shopifyProducts: shopifyProductsSchema,
};

export const createArtworkRouteSchema = z
  .object({
    ...artworkRouteFields,
    shopifyProducts: artworkRouteFields.shopifyProducts.optional(),
    image: routeCloudinaryImageSchema,
  })
  .strict();

export const updateArtworkRouteParamsSchema = z.object({
  id: objectIdStringSchema("Invalid artwork ID"),
});

export const updateArtworkRouteBodySchema = z
  .object({
    title: artworkRouteFields.title.optional(),
    decade: artworkRouteFields.decade.optional(),
    artstyle: artworkRouteFields.artstyle.optional(),
    medium: artworkRouteFields.medium.optional(),
    surface: artworkRouteFields.surface.optional(),
    featured: artworkRouteFields.featured.optional(),
    shopifyProducts: artworkRouteFields.shopifyProducts.optional(),
    image: routeCloudinaryImageSchema.optional(),
  })
  .strict();

export type UpdateArtworkFormValues = z.infer<typeof updateArtworkSchema>;
export type CreateArtworkRouteInput = z.infer<typeof createArtworkRouteSchema>;
export type UpdateArtworkRouteParams = z.infer<
  typeof updateArtworkRouteParamsSchema
>;
export type UpdateArtworkRouteBody = z.infer<
  typeof updateArtworkRouteBodySchema
>;
