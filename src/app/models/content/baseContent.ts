import mongoose, { Document } from "mongoose";

// this model is the base model for all content types
export interface IContent extends Document {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: mongoose.Schema.Types.ObjectId;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
}

// this is the base schema for all article/collection types
const baseOptions = {
  discriminatorKey: "contentType", // our discriminator key
  collection: "content", // name of the collection in MongoDB
  timestamps: true, // automatically include createdAt and updatedAt
};

const baseSchema = new mongoose.Schema<IContent>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    summary: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    imageUrl: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    section: {
      type: String,
      required: true,
      enum: ["artwork", "biography", "project"],
    },
  },
  baseOptions
);

const ContentModel =
  mongoose.models?.Content || mongoose.model<IContent>("Content", baseSchema);

export { ContentModel };
