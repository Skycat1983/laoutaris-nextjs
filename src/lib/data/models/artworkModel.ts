import mongoose, { Document, InferSchemaType } from "mongoose";
import { ColorInfo, PredominantColors } from "../types";

export interface BaseArtwork {
  title: string;
  decade:
    | "1950s"
    | "1960s"
    | "1970s"
    | "1980s"
    | "1990s"
    | "2000s"
    | "2010s"
    | "2020s";
  artstyle: "abstract" | "semi-abstract" | "figurative";
  medium:
    | "oil"
    | "acrylic"
    | "paint"
    | "watercolour"
    | "pastel"
    | "pencil"
    | "charcoal"
    | "ink"
    | "sand";
  surface: "paper" | "canvas" | "wood" | "film";
  featured: boolean;
}

export interface DBImage {
  secure_url: string;
  public_id: string;
  bytes: number;
  pixelHeight: number;
  pixelWidth: number;
  format: string;
  hexColors: ColorInfo[];
  predominantColors: PredominantColors;
}

export interface DBArtwork extends Document, BaseArtwork {
  image: DBImage;
  collections: mongoose.Schema.Types.ObjectId[];
  watcherlist: mongoose.Schema.Types.ObjectId[];
  favourited: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// export interface PublicImage {
//   secure_url: string;
//   public_id: string;
//   bytes: number;
//   pixelHeight: number;
//   pixelWidth: number;
//   format: string;
//   hexColors: ColorInfo[];
//   predominantColors: PredominantColors;
// }

// ! PublicArtworkImage with Pick
/*
export type PublicArtworkImage = Pick<
  ArtworkImage,
  | "secure_url"
  | "bytes"
  | "pixelHeight"
  | "pixelWidth"
  | "format"
  | "hexColors"
  | "predominantColors"
>;

export type PublicArtwork = Pick<
  LeanArtwork,
  | "title"
  | "decade"
  | "artstyle"
  | "medium"
  | "surface"
  | "featured"
  | "createdAt"
  | "updatedAt"
  | "collections"
> & {
  _id: string;
  image: PublicArtworkImage;
  favouritedCount: number;
  watchlistCount: number;
  isFavourited: boolean;
  isWatchlisted: boolean;
};
*/

// ! PublicArtwork with Omit
/*
export type PublicArtwork = Omit<
  LeanArtwork,
  "watcherlist" | "favourited" | "image"
> & {
  image: PublicArtworkImage;
  favouritedCount: number;
  watchlistCount: number;
  isFavourited: boolean;
  isWatchlisted: boolean;
};
*/

// export type ArtworkSchemaType = InferSchemaType<typeof artworkSchema>;

const artworkSchema = new mongoose.Schema(
  {
    //! submitted fields
    title: { type: String, default: "Untitled" },
    decade: {
      type: String,
      enum: [
        "1950s",
        "1960s",
        "1970s",
        "1980s",
        "1990s",
        "2000s",
        "2010s",
        "2020s",
      ],
      required: true,
    },
    image: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
      bytes: { type: Number, required: true },
      pixelHeight: { type: Number, required: true },
      pixelWidth: { type: Number, required: true },
      format: { type: String, required: true },
      hexColors: [
        {
          color: { type: String, required: true },
          percentage: { type: Number, required: true },
        },
      ],
      predominantColors: {
        cloudinary: [
          {
            color: { type: String, required: true },
            percentage: { type: Number, required: true },
          },
        ],
        google: [
          {
            color: { type: String, required: true },
            percentage: { type: Number, required: true },
          },
        ],
      },
    },
    artstyle: {
      type: String,
      enum: ["abstract", "semi-abstract", "figurative"],
      required: true,
    },
    medium: {
      type: String,
      enum: [
        "oil",
        "acrylic",
        "paint",
        "watercolour",
        "pastel",
        "pencil",
        "charcoal",
        "ink",
        "sand",
      ],
      required: true,
    },
    surface: {
      type: String,
      enum: ["paper", "canvas", "wood", "film"],
      required: true,
    },
    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection",
        required: true,
      },
    ],
    featured: { type: Boolean, default: false },
    watcherlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    favourited: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const ArtworkModel =
  mongoose.models.Artwork ||
  mongoose.model<DBArtwork>("Artwork", artworkSchema);

// export type LeanDocument<T> = T & { $locals?: never };

// export type LeanArtwork = LeanDocument<DBArtwork>;
// image: {
//   secure_url: string;
//   public_id: string;
//   bytes: number;
//   pixelHeight: number;
//   pixelWidth: number;
//   format: string;
//   hexColors: ColorInfo[];
//   predominantColors: PredominantColors;
// };
