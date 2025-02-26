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

export const apiUpdateBlogSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  subtitle: z.string().min(1, "Subtitle is required").optional(),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .optional(),
  text: z
    .string()
    .min(50, "Blog text must be at least 50 characters")
    .optional(),
  imageUrl: z.string().url("Invalid URL").optional(),
  displayDate: z
    .string()
    .or(z.date())
    .transform((val) => (val ? new Date(val) : undefined))
    .optional(),
  featured: z.boolean().optional(),
  // tags: z.array(z.string()).optional(),
});

export type ApiUpdateBlogValues = z.infer<typeof apiUpdateBlogSchema>;
