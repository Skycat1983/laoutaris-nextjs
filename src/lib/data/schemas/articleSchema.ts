import { z } from "zod";

export const articleBaseFields = {
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  text: z.string().min(50, "Article text must be at least 50 characters"),
  imageUrl: z.string().url("Invalid URL"),
  section: z.enum(["artwork", "biography", "project", "collections"] as const),
  overlayColour: z.enum(["white", "black"] as const),
  artwork: z.string(),
};

export const createArticleSchema = z.object({
  ...articleBaseFields,
});

export type CreateArticleFormValues = z.infer<typeof createArticleSchema>;

export const updateArticleSchema = z.object({
  ...articleBaseFields,
});

export type UpdateArticleFormValues = z.infer<typeof updateArticleSchema>;
