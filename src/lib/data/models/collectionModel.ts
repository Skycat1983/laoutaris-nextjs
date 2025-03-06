import mongoose, { Document } from "mongoose";

type Section = "artwork" | "biography" | "project" | "collections";

interface BaseCollection {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  imageUrl: string;
  slug: string;
  section: Section;
}

export interface DBCollection extends Document, BaseCollection {
  createdAt: Date;
  updatedAt: Date;
  artworks: mongoose.Schema.Types.ObjectId[];
}

export type LeanCollection = Omit<DBCollection, keyof Document> & {
  _id: string;
  artworks: string[];
  createdAt: Date;
  updatedAt: Date;
};

const collectionSchema = new mongoose.Schema<DBCollection>(
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
      enum: ["artwork", "biography", "project", "collections"],
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
  mongoose.model<DBCollection>("Collection", collectionSchema);

export { CollectionModel };
