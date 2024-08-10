import mongoose, { Document } from "mongoose";

// Define the union types for specific fields
// export type Decade =
//   | "1950s"
//   | "1960s"
//   | "1970s"
//   | "1980s"
//   | "1990s"
//   | "2000s"
//   | "2010s"
//   | "2020s";

// export type ArtStyle = "abstract" | "semi-abstract" | "figurative";

// export type Medium =
//   | "oil"
//   | "acrylic"
//   | "paint"
//   | "watercolour"
//   | "pastel"
//   | "pencil"
//   | "charcoal"
//   | "ink"
//   | "sand";

// export type Surface = "paper" | "canvas" | "wood" | "film";

// // Define the interface for image colors
// export interface Color {
//   color: string;
//   percentage: number;
//   _id: string; // Make _id optional in case it's not available
// }

// export interface PredominantColors {
//   cloudinary: Color[];
//   google: Color[];
// }

// export interface Image {
//   secure_url: string;
//   public_id: string;
//   bytes: number;
//   pixelHeight: number;
//   pixelWidth: number;
//   format: string;
//   hexColors: Color[];
//   predominantColors: PredominantColors;
// }

// // Define the main IArtwork interface
// export interface IArtwork extends Document {
//   _id: string;
//   title: string;
//   decade: Decade;
//   artstyle: ArtStyle;
//   medium: Medium;
//   surface: Surface;
//   featured: boolean;
//   watcherlist: mongoose.Schema.Types.ObjectId[];
//   image: Image;
//   __v: number;
// }

export interface IArtwork extends Document {
  title?: string;
  decade:
    | "1950s"
    | "1960s"
    | "1970s"
    | "1980s"
    | "1990s"
    | "2000s"
    | "2010s"
    | "2020s";
  image: {
    secure_url: string;
    public_id: string;
    bytes: number;
    pixelHeight: number;
    pixelWidth: number;
    format: string;
    hexColors: { color: string; percentage: number }[];
    predominantColors: {
      cloudinary: { color: string; percentage: number; _id: string }[];
      google: { color: string; percentage: number; _id: string }[];
    };
  };
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
  featured?: boolean;
  watcherlist?: mongoose.Schema.Types.ObjectId[];
}

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
      hexColors: [{ color: String, percentage: Number }],
      predominantColors: {
        cloudinary: [{ color: String, percentage: Number }],
        google: [{ color: String, percentage: Number }],
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
    featured: { type: Boolean, default: false },
    watcherlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true }
);

export const ArtworkModel =
  mongoose.models.Artwork || mongoose.model<IArtwork>("Artwork", artworkSchema);

// const BaseModel =
// mongoose.models.Content || mongoose.model("Content", baseSchema);
