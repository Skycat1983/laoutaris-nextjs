import { z } from "zod";
import { cloudinaryImageSchema } from "./cloudinarySchema";

// Base fields for artwork

// Schema for form input data
export const artworkFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  decade: z.enum([
    "1950s",
    "1960s",
    "1970s",
    "1980s",
    "1990s",
    "2000s",
    "2010s",
    "2020s",
  ] as const),
  artstyle: z.enum(["abstract", "semi-abstract", "figurative"] as const),
  medium: z.enum([
    "oil",
    "acrylic",
    "paint",
    "watercolour",
    "pastel",
    "pencil",
    "charcoal",
    "ink",
    "sand",
  ] as const),
  surface: z.enum(["paper", "canvas", "wood", "film"] as const),
  featured: z.boolean().default(false),
});

export type ArtworkFormValues = z.infer<typeof artworkFormSchema>;

export const createArtworkSchema = artworkFormSchema.extend({
  image: cloudinaryImageSchema,
});

export type CreateArtworkFormValues = z.infer<typeof createArtworkSchema>;

export const updateArtworkSchema = artworkFormSchema.extend({
  image: cloudinaryImageSchema,
});

export type UpdateArtworkFormValues = z.infer<typeof updateArtworkSchema>;
