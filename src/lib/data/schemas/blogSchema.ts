import { z } from "zod";

export const CreateBlogFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  subtitle: z.string().min(2, "Subtitle must be at least 2 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  text: z.string().min(50, "Blog text must be at least 50 characters"),
  imageUrl: z.string().url("Please enter a valid URL"),
  // tags: z.string(),
  featured: z.boolean().default(false),
  displayDate: z.coerce.date(),
});
