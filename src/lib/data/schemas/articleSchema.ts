import { z } from "zod";
import {
  ARTICLE_OVERLAY_COLOUR_OPTIONS,
  ARTICLE_SECTION_OPTIONS,
} from "@/lib/constants/articleConstants";

const ARTICLE_FIELD_LIMITS = {
  title: 200,
  subtitle: 300,
  summary: 1000,
  text: 20000,
  imageUrl: 2048,
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

const articleBaseFields = {
  title: requiredTrimmedString("Title")
    .min(1, "Title is required")
    .max(
      ARTICLE_FIELD_LIMITS.title,
      `Title must be ${ARTICLE_FIELD_LIMITS.title} characters or fewer`
    ),
  subtitle: requiredTrimmedString("Subtitle")
    .min(1, "Subtitle is required")
    .max(
      ARTICLE_FIELD_LIMITS.subtitle,
      `Subtitle must be ${ARTICLE_FIELD_LIMITS.subtitle} characters or fewer`
    ),
  summary: requiredTrimmedString("Summary")
    .min(10, "Summary must be at least 10 characters")
    .max(
      ARTICLE_FIELD_LIMITS.summary,
      `Summary must be ${ARTICLE_FIELD_LIMITS.summary} characters or fewer`
    ),
  text: requiredTrimmedString("Article text")
    .min(50, "Article text must be at least 50 characters")
    .max(
      ARTICLE_FIELD_LIMITS.text,
      `Article text must be ${ARTICLE_FIELD_LIMITS.text} characters or fewer`
    ),
  imageUrl: z
    .string({
      required_error: "Image URL is required",
      invalid_type_error: "Image URL must be a string",
    })
    .trim()
    .url("Invalid URL")
    .max(
      ARTICLE_FIELD_LIMITS.imageUrl,
      `Image URL must be ${ARTICLE_FIELD_LIMITS.imageUrl} characters or fewer`
    ),
  section: z.enum(ARTICLE_SECTION_OPTIONS),
  overlayColour: z.enum(ARTICLE_OVERLAY_COLOUR_OPTIONS),
  artwork: objectIdStringSchema("Invalid artwork ID"),
};

export const createArticleSchema = z.object({
  ...articleBaseFields,
});

export type CreateArticleFormValues = z.infer<typeof createArticleSchema>;

export const updateArticleSchema = z.object({
  ...articleBaseFields,
});

export const createArticleRouteSchema = createArticleSchema.strict();

export const updateArticleRouteParamsSchema = z.object({
  id: objectIdStringSchema("Invalid article ID"),
});

export const updateArticleRouteBodySchema = z
  .object({
    title: articleBaseFields.title.optional(),
    subtitle: articleBaseFields.subtitle.optional(),
    summary: articleBaseFields.summary.optional(),
    text: articleBaseFields.text.optional(),
    imageUrl: articleBaseFields.imageUrl.optional(),
    section: articleBaseFields.section.optional(),
    overlayColour: articleBaseFields.overlayColour.optional(),
    artwork: articleBaseFields.artwork.optional(),
  })
  .strict();

export type UpdateArticleFormValues = z.infer<typeof updateArticleSchema>;
export type CreateArticleRouteInput = z.infer<typeof createArticleRouteSchema>;
export type UpdateArticleRouteParams = z.infer<
  typeof updateArticleRouteParamsSchema
>;
export type UpdateArticleRouteBody = z.infer<
  typeof updateArticleRouteBodySchema
>;
