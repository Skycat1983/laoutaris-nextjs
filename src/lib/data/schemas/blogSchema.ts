import { z } from "zod";

const blogBaseFields = {
  title: z.string().min(2, "Title must be at least 2 characters"),
  subtitle: z.string().min(2, "Subtitle must be at least 2 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  text: z.string().min(50, "Blog text must be at least 50 characters"),
  imageUrl: z.string().url("Please enter a valid URL"),
  featured: z.boolean().default(false),
  displayDate: z.coerce.date(),
};

export const createBlogFormSchema = z.object({
  ...blogBaseFields,
  // tags: z.string(),
});

export type CreateBlogFormValues = z.infer<typeof createBlogFormSchema>;

export const updateBlogFormSchema = z.object({
  ...blogBaseFields,
});

export type UpdateBlogFormValues = z.infer<typeof updateBlogFormSchema>;
