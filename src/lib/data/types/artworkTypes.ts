import { FrontendUser, FrontendUserUnpopulated } from "./userTypes";
import { ColorInfo } from "./colorTypes";
import { FrontendCollection } from "./collectionTypes";
import { FrontendComment } from "./commentTypes";
import { z } from "zod";

interface BaseFrontendArtwork {
  _id: string;
  title: string;
  image: ArtworkImage;
  decade: Decade;
  artstyle: ArtStyle;
  medium: Medium;
  surface: Surface;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type PopulatedField<T> = string | T | Partial<T>;

export interface FrontendArtwork extends BaseFrontendArtwork {
  watcherlist: PopulatedField<FrontendUser>[];
  favourited: PopulatedField<FrontendUser>[];
}

export interface FrontendArtworkUnpopulated extends BaseFrontendArtwork {
  collections: string[];
  watcherlist: string[];
  favourited: string[];
}

export interface FrontendArtworkWithCollections extends FrontendArtwork {
  collections: FrontendCollection[];
  watcherlist: string[];
  favourited: string[];
}

export interface FrontendArtworkWithWatcherlist extends FrontendArtwork {
  collections: string[];
  watcherlist: FrontendUserUnpopulated[];
  favourited: string[];
}

export interface FrontendArtworkWithFavourited extends FrontendArtwork {
  collections: string[];
  watcherlist: string[];
  favourited: FrontendUserUnpopulated[];
}

export interface FrontendArtworkFull extends FrontendArtwork {
  collections: FrontendCollection[];
  watcherlist: FrontendUserUnpopulated[];
  favourited: FrontendUserUnpopulated[];
}

export interface PublicFrontendArtwork extends BaseFrontendArtwork {
  favouriteCount: number;
  watchCount: number;
}

export type Decade =
  | "1950s"
  | "1960s"
  | "1970s"
  | "1980s"
  | "1990s"
  | "2000s"
  | "2010s"
  | "2020s";

export type ArtStyle = "abstract" | "semi-abstract" | "figurative";

export type Medium =
  | "oil"
  | "acrylic"
  | "paint"
  | "watercolour"
  | "pastel"
  | "pencil"
  | "charcoal"
  | "ink"
  | "sand";

export type Surface = "paper" | "canvas" | "wood" | "film";

export interface ArtworkImage {
  secure_url: string;
  public_id: string;
  bytes: number;
  pixelHeight: number;
  pixelWidth: number;
  format: string;
  hexColors: ColorInfo[];
  predominantColors: PredominantColors;
}

export interface PredominantColors {
  cloudinary: CloudinaryColor[];
  google: GoogleColor[];
}

export interface CloudinaryColor {
  color: string;
  percentage: number;
  // _id: string;
}

export interface GoogleColor {
  color: string;
  percentage: number;
  // _id: string;
}

export interface HexColor {
  color: string;
  percentage: number;
  // _id: string;
}

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
