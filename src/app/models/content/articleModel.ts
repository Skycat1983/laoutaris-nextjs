import mongoose, { Document } from "mongoose";

// Define the interface that includes both content and article-specific fields
export interface IArticleContent extends Document {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: mongoose.Schema.Types.ObjectId;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  overlayColour: "white" | "black";
}

// Combine the schemas into one
const articleContentSchema = new mongoose.Schema<IArticleContent>(
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
    overlayColour: {
      type: String,
      required: true,
      enum: ["white", "black"],
    },
  },
  {
    collection: "articles", // Name of the collection in MongoDB
    timestamps: true, // Automatically include createdAt and updatedAt
  }
);

const ArticleModel =
  mongoose.models?.ArticleContent ||
  mongoose.model<IArticleContent>("ArticleContent", articleContentSchema);

export { ArticleModel };
