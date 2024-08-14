import mongoose, { Document } from "mongoose";
import { IContent } from "../../../unused/experimental/baseContent";

// Define the interface that includes both content and collection-specific fields
export interface ICollectionContent extends Document {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: mongoose.Schema.Types.ObjectId;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  artworks: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Combine the schemas into one
const collectionSchema = new mongoose.Schema<ICollectionContent>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    summary: { type: String, required: true },
    text: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    imageUrl: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    section: {
      type: String,
      required: true,
      enum: ["artwork", "biography", "project"],
    },
    artworks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artwork" }],
  },
  {
    collection: "collections", // Specify the collection name
    timestamps: true, // Automatically include createdAt and updatedAt
  }
);

const CollectionModel =
  mongoose.models.Collection ||
  mongoose.model<ICollectionContent>("Collection", collectionSchema);

export { CollectionModel };
