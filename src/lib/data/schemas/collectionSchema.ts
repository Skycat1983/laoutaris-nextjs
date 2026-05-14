import { z } from "zod";
import { COLLECTION_SECTIONS } from "@/lib/constants/collectionConstants";

const COLLECTION_FIELD_LIMITS = {
  title: 200,
  subtitle: 300,
  summary: 1000,
  text: 10000,
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

const collectionBaseFields = {
  title: requiredTrimmedString("Title")
    .min(1, "Title is required")
    .max(
      COLLECTION_FIELD_LIMITS.title,
      `Title must be ${COLLECTION_FIELD_LIMITS.title} characters or fewer`
    ),
  subtitle: requiredTrimmedString("Subtitle")
    .min(1, "Subtitle is required")
    .max(
      COLLECTION_FIELD_LIMITS.subtitle,
      `Subtitle must be ${COLLECTION_FIELD_LIMITS.subtitle} characters or fewer`
    ),
  summary: requiredTrimmedString("Summary")
    .min(1, "Summary is required")
    .max(
      COLLECTION_FIELD_LIMITS.summary,
      `Summary must be ${COLLECTION_FIELD_LIMITS.summary} characters or fewer`
    ),
  text: requiredTrimmedString("Text content")
    .min(1, "Text content is required")
    .max(
      COLLECTION_FIELD_LIMITS.text,
      `Text content must be ${COLLECTION_FIELD_LIMITS.text} characters or fewer`
    ),
  imageUrl: z
    .string({
      required_error: "Image URL is required",
      invalid_type_error: "Image URL must be a string",
    })
    .trim()
    .url("Must be a valid URL")
    .max(
      COLLECTION_FIELD_LIMITS.imageUrl,
      `Image URL must be ${COLLECTION_FIELD_LIMITS.imageUrl} characters or fewer`
    ),
};

const collectionSectionSchema = z.enum(COLLECTION_SECTIONS);

// shape and rules for the create collection form
export const createCollectionSchema = z.object({
  ...collectionBaseFields,
  section: collectionSectionSchema.default("collections"),
});

// type for the create collection form
export type CreateCollectionFormValues = z.infer<typeof createCollectionSchema>;

// shape and rules for the update collection form
export const updateCollectionSchema = z.object({
  ...collectionBaseFields,
  artworksToAdd: z.array(z.string()).optional(),
  artworksToRemove: z.array(z.string()).optional(),
});

export const createCollectionRouteSchema = createCollectionSchema.strict();

export const updateCollectionRouteParamsSchema = z.object({
  id: objectIdStringSchema("Invalid collection ID"),
});

export const updateCollectionRouteBodySchema = z
  .object({
    title: collectionBaseFields.title.optional(),
    subtitle: collectionBaseFields.subtitle.optional(),
    summary: collectionBaseFields.summary.optional(),
    text: collectionBaseFields.text.optional(),
    imageUrl: collectionBaseFields.imageUrl.optional(),
    section: collectionSectionSchema.optional(),
    artworksToAdd: z
      .array(objectIdStringSchema("Invalid artwork ID"))
      .optional(),
    artworksToRemove: z
      .array(objectIdStringSchema("Invalid artwork ID"))
      .optional(),
  })
  .strict();

export type UpdateCollectionFormValues = z.infer<typeof updateCollectionSchema>;
export type CreateCollectionRouteInput = z.infer<
  typeof createCollectionRouteSchema
>;
export type UpdateCollectionRouteParams = z.infer<
  typeof updateCollectionRouteParamsSchema
>;
export type UpdateCollectionRouteBody = z.infer<
  typeof updateCollectionRouteBodySchema
>;
