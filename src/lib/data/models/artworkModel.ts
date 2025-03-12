import mongoose, { Document } from "mongoose";
import { CloudinaryImageDB, ColourInfo, PredominantColors } from "../types";
import {
  ArtStyle,
  Medium,
  Surface,
  Decade,
  DECADE_OPTIONS,
  ARTSTYLE_OPTIONS,
  MEDIUM_OPTIONS,
  SURFACE_OPTIONS,
} from "@/lib/constants/artworkConstants";

export interface ArtworkBase {
  title: string;
  decade: Decade;
  artstyle: ArtStyle;
  medium: Medium;
  surface: Surface;
  featured: boolean;
  image: CloudinaryImageDB;
}

export interface ArtworkDB extends Document, ArtworkBase {
  collections: mongoose.Schema.Types.ObjectId[];
  watcherlist: mongoose.Schema.Types.ObjectId[];
  favourited: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const artworkSchema = new mongoose.Schema(
  {
    //! submitted fields
    title: { type: String, default: "Untitled" },
    decade: {
      type: String,
      enum: DECADE_OPTIONS,
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
      enum: ARTSTYLE_OPTIONS,
      required: true,
    },
    medium: {
      type: String,
      enum: MEDIUM_OPTIONS,
      required: true,
    },
    surface: {
      type: String,
      enum: SURFACE_OPTIONS,
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
  mongoose.model<ArtworkDB>("Artwork", artworkSchema);

// export interface DBImage {
//   secure_url: string;
//   public_id: string;
//   bytes: number;
//   pixelHeight: number;
//   pixelWidth: number;
//   format: string;
//   hexColors: ColourInfo[];
//   predominantColors: PredominantColors;
// }
