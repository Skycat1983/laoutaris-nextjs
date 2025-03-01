import { z } from "zod";

export const cloudinaryImageSchema = z.object({
  secure_url: z.string().url(),
  public_id: z.string(),
  bytes: z.number(),
  pixelHeight: z.number(),
  pixelWidth: z.number(),
  format: z.string(),
  hexColors: z.array(z.any()),
  predominantColors: z.object({
    cloudinary: z.array(z.any()),
    google: z.array(z.any()),
  }),
});

export type CloudinaryImage = z.infer<typeof cloudinaryImageSchema>;
