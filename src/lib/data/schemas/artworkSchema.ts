import { z } from "zod";

// Base fields for artwork
const artworkBaseFields = {
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
  featured: z.boolean(),
  image: z.object({
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
  }),
} as const;

// Create schema extends base with any create-specific modifications
export const createArtworkSchema = z.object({
  ...artworkBaseFields,
  featured: z.boolean().default(false),
});

// Update schema can extend base with any update-specific modifications
export const updateArtworkSchema = z.object({
  ...artworkBaseFields,
});

export type CreateArtworkFormValues = z.infer<typeof createArtworkSchema>;
export type UpdateArtworkFormValues = z.infer<typeof updateArtworkSchema>;
