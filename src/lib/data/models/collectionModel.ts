import mongoose, { Document } from "mongoose";
import { COLLECTION_SECTIONS, CollectionSection } from "@/lib/constants";
export interface CollectionBase {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  imageUrl: string;
  slug: string;
  section: CollectionSection;
}

export interface CollectionDB extends Document, CollectionBase {
  createdAt: Date;
  updatedAt: Date;
  artworks: mongoose.Schema.Types.ObjectId[];
}

const collectionSchema = new mongoose.Schema<CollectionDB>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    summary: { type: String, required: true },
    text: { type: String, required: true },
    imageUrl: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    section: {
      type: String,
      required: false,
      default: "collections",
      enum: COLLECTION_SECTIONS,
    },
    artworks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artwork" }],
  },
  {
    collection: "collections",
    timestamps: true,
  }
);

const CollectionModel =
  mongoose.models.Collection ||
  mongoose.model<CollectionDB>("Collection", collectionSchema);

export { CollectionModel };
