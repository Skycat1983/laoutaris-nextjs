import mongoose, { Document } from "mongoose";

type Section = "artwork" | "biography" | "project" | "collections";
type OverlayColour = "white" | "black";

export interface DBArticle extends Document {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: mongoose.Schema.Types.ObjectId;
  imageUrl: string;
  artwork: mongoose.Schema.Types.ObjectId;
  slug: string;
  section: Section;
  overlayColour: OverlayColour;
}

const articleContentSchema = new mongoose.Schema<DBArticle>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    summary: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    artwork: { type: mongoose.Schema.Types.ObjectId, ref: "Artwork" },
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
    collection: "articles",
    timestamps: true,
  }
);

const ArticleModel =
  mongoose.models.Article ||
  mongoose.model<DBArticle>("Article", articleContentSchema);

export { ArticleModel };
