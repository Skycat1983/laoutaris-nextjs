import { z } from "zod";

// Existing schemas
export const SignupFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(5),
});

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// First, define the image schema
const ArtworkImageSchema = z.object({
  format: z.string(),
  pixelWidth: z.number(),
  pixelHeight: z.number(),
  bytes: z.number(),
  public_id: z.string(),
  secure_url: z.string(),
  // Add any other required fields
});

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

// export const CreateBlogFormSchema = z.object({
//   title: z.string().min(2, "Title must be at least 2 characters"),
//   subtitle: z.string().min(2, "Subtitle must be at least 2 characters"),
//   summary: z.string().min(10, "Summary must be at least 10 characters"),
//   text: z.string().min(50, "Blog text must be at least 50 characters"),
//   imageUrl: z.string().url("Please enter a valid URL"),
//   tags: z.string().transform((str) =>
//     str
//       .split(",")
//       .map((tag) => tag.trim())
//       .filter((tag) => tag.length > 0)
//   ),
//   featured: z.boolean().default(false),
//   displayDate: z.date(),
// });
