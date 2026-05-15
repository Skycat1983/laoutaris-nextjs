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
});

export type ArtworkFormValues = z.infer<typeof artworkFormSchema>;

export const createArtworkSchema = artworkFormSchema.extend({
  image: cloudinaryImageSchema,
});

export type CreateArtworkFormValues = z.infer<typeof createArtworkSchema>;

export const updateArtworkSchema = artworkFormSchema;

const routeCloudinaryImageSchema = cloudinaryImageSchema.strict();

const artworkRouteFields = {
  title: artworkFormSchema.shape.title,
  decade: artworkFormSchema.shape.decade,
  artstyle: artworkFormSchema.shape.artstyle,
  medium: artworkFormSchema.shape.medium,
  surface: artworkFormSchema.shape.surface,
  featured: artworkFormSchema.shape.featured,
};

export const createArtworkRouteSchema = z
  .object({
    ...artworkRouteFields,
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
