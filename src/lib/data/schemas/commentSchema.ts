import { z } from "zod";

const commentBaseFields = {
  text: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be less than 1000 characters")
    .trim(),
  displayDate: z.coerce.date(),
};

export const createCommentSchema = z.object({
  ...commentBaseFields,
  blogSlug: z.string(),
});

export const updateCommentSchema = z.object({
  text: commentBaseFields.text,
  commentId: z.string(),
});

export type CreateCommentFormValues = z.infer<typeof createCommentSchema>;
export type UpdateCommentFormValues = z.infer<typeof updateCommentSchema>;
