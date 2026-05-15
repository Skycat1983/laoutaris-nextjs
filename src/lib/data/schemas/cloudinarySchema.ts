import { z } from "zod";

const colourInfoSchema = z
  .object({
    color: z.string(),
    percentage: z.number(),
  })
  .strict();

export const cloudinaryImageSchema = z.object({
  secure_url: z.string().url(),
  public_id: z.string(),
  bytes: z.number(),
  pixelHeight: z.number(),
  pixelWidth: z.number(),
  format: z.string(),
  hexColors: z.array(colourInfoSchema),
  predominantColors: z.object({
    cloudinary: z.array(colourInfoSchema),
    google: z.array(colourInfoSchema),
  }),
});

export type CloudinaryImage = z.infer<typeof cloudinaryImageSchema>;
