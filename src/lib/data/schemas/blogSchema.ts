import { z } from "zod";

const BLOG_FIELD_LIMITS = {
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

const displayDateSchema = z
  .union([z.string(), z.date()], {
    required_error: "Display date is required",
    invalid_type_error: "Display date must be a valid date",
  })
  .transform((value, ctx) => {
    const date = value instanceof Date ? value : new Date(value.trim());

    if (Number.isNaN(date.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Display date must be a valid date",
      });
      return z.NEVER;
    }

    return date;
  });

const blogBaseFields = {
  title: requiredTrimmedString("Title")
    .min(2, "Title must be at least 2 characters")
    .max(
      BLOG_FIELD_LIMITS.title,
      `Title must be ${BLOG_FIELD_LIMITS.title} characters or fewer`
    ),
  subtitle: requiredTrimmedString("Subtitle")
    .min(2, "Subtitle must be at least 2 characters")
    .max(
      BLOG_FIELD_LIMITS.subtitle,
      `Subtitle must be ${BLOG_FIELD_LIMITS.subtitle} characters or fewer`
    ),
  summary: requiredTrimmedString("Summary")
    .min(10, "Summary must be at least 10 characters")
    .max(
      BLOG_FIELD_LIMITS.summary,
      `Summary must be ${BLOG_FIELD_LIMITS.summary} characters or fewer`
    ),
  text: requiredTrimmedString("Blog text")
    .min(50, "Blog text must be at least 50 characters")
    .max(
      BLOG_FIELD_LIMITS.text,
      `Blog text must be ${BLOG_FIELD_LIMITS.text} characters or fewer`
    ),
  imageUrl: z
    .string({
      required_error: "Image URL is required",
      invalid_type_error: "Image URL must be a string",
    })
    .trim()
    .url("Please enter a valid URL")
    .max(
      BLOG_FIELD_LIMITS.imageUrl,
      `Image URL must be ${BLOG_FIELD_LIMITS.imageUrl} characters or fewer`
    ),
  featured: z.boolean().default(false),
  displayDate: displayDateSchema,
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

export const createBlogRouteSchema = createBlogFormSchema.strict();

export const updateBlogRouteParamsSchema = z.object({
  id: objectIdStringSchema("Invalid blog ID"),
});

export const apiUpdateBlogSchema = z
  .object({
    title: blogBaseFields.title.optional(),
    subtitle: blogBaseFields.subtitle.optional(),
    summary: blogBaseFields.summary.optional(),
    text: blogBaseFields.text.optional(),
    imageUrl: blogBaseFields.imageUrl.optional(),
    displayDate: blogBaseFields.displayDate.optional(),
    featured: blogBaseFields.featured.optional(),
  })
  .strict();

export type ApiUpdateBlogValues = z.infer<typeof apiUpdateBlogSchema>;
export type CreateBlogRouteInput = z.infer<typeof createBlogRouteSchema>;
export type UpdateBlogRouteParams = z.infer<
  typeof updateBlogRouteParamsSchema
>;
export type UpdateBlogRouteBody = z.infer<typeof apiUpdateBlogSchema>;
