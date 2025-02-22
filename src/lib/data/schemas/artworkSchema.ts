import { z } from "zod";

// Base fields for Zod validation
export const artworkImageFields = {
  secure_url: z.string().url(),
  public_id: z.string(),
  bytes: z.number().positive(),
  pixelHeight: z.number().positive(),
  pixelWidth: z.number().positive(),
  format: z.string(),
  hexColors: z.array(
    z.object({
      color: z.string(),
      percentage: z.number(),
    })
  ),
  predominantColors: z.object({
    cloudinary: z.array(
      z.object({
        color: z.string(),
        percentage: z.number(),
      })
    ),
    google: z.array(
      z.object({
        color: z.string(),
        percentage: z.number(),
      })
    ),
  }),
} as const;

// Zod schema for validation
export const ArtworkImageSchema = z.object(artworkImageFields);

// TypeScript type from Zod schema
export type ArtworkImage = z.infer<typeof ArtworkImageSchema>;

export const updateArtworkSchema = z.object({
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
    hexColors: z.array(z.any()), // ColorInfo type
    predominantColors: z.object({
      cloudinary: z.array(z.any()), // CloudinaryColor type
      google: z.array(z.any()), // GoogleColor type
    }),
  }),
});

export type UpdateArtworkFormValues = z.infer<typeof updateArtworkSchema>;

export const createArtworkSchema = z.object({
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
  image: z.object({
    secure_url: z.string().url(),
    public_id: z.string(),
    bytes: z.number(),
    pixelHeight: z.number(),
    pixelWidth: z.number(),
    format: z.string(),
    hexColors: z.array(z.any()), // ColorInfo type
    predominantColors: z.object({
      cloudinary: z.array(z.any()),
      google: z.array(z.any()),
    }),
  }),
});

export type CreateArtworkFormValues = z.infer<typeof createArtworkSchema>;
