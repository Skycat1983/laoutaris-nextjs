import { z } from "zod";

const collectionBaseFields = {
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  summary: z.string().min(1, "Summary is required"),
  text: z.string().min(1, "Text content is required"),
  imageUrl: z.string().url("Must be a valid URL"),
};

// shape and rules for the create collection form
export const createCollectionSchema = z.object({
  ...collectionBaseFields,
  section: z
    .enum(["artwork", "biography", "project", "collections"])
    .default("collections"),
});

// type for the create collection form
export type CreateCollectionFormValues = z.infer<typeof createCollectionSchema>;

// shape and rules for the update collection form
export const updateCollectionSchema = z.object({
  ...collectionBaseFields,
  artworksToAdd: z.array(z.string()).optional(),
  artworksToRemove: z.array(z.string()).optional(),
});

export type UpdateCollectionFormValues = z.infer<typeof updateCollectionSchema>;
