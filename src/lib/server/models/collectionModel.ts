import mongoose, { Document } from "mongoose";

export interface DBCollection extends Document {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  // author: mongoose.Schema.Types.ObjectId;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  artworks: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema = new mongoose.Schema<DBCollection>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    summary: { type: String, required: true },
    text: { type: String, required: true },
    // author: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "user",
    //   required: true,
    // },
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
    collection: "collections",
    timestamps: true,
  }
);

const CollectionModel =
  mongoose.models.Collection ||
  mongoose.model<DBCollection>("Collection", collectionSchema);

export { CollectionModel };
