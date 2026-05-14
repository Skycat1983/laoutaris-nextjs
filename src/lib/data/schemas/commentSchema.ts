import { z } from "zod";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid comment ID");

const commentTextSchema = z
  .string()
  .trim()
  .min(1, "Comment cannot be empty")
  .max(1000, "Comment must be less than 1000 characters");

const blogSlugSchema = z.string().trim().min(1, "Blog slug is required");

const commentBaseFields = {
  text: commentTextSchema,
  displayDate: z.coerce.date(),
};

export const createCommentSchema = z.object({
  ...commentBaseFields,
  blogSlug: blogSlugSchema,
});

export const createCommentRouteSchema = z.object({
  text: commentTextSchema,
  blogSlug: blogSlugSchema,
});

export const updateCommentSchema = z.object({
  text: commentBaseFields.text,
  commentId: z.string(),
});

export const updateCommentRouteParamsSchema = z.object({
  commentId: objectIdSchema,
});

export const updateCommentRouteBodySchema = updateCommentSchema.pick({
  text: true,
});

export type CreateCommentFormValues = z.infer<typeof createCommentSchema>;
export type UpdateCommentFormValues = z.infer<typeof updateCommentSchema>;
export type CreateCommentRouteInput = z.infer<typeof createCommentRouteSchema>;
export type UpdateCommentRouteParams = z.infer<
  typeof updateCommentRouteParamsSchema
>;
export type UpdateCommentRouteBody = z.infer<typeof updateCommentRouteBodySchema>;
