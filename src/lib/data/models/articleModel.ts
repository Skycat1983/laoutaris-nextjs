import {
  ArticleOverlayColour,
  ArticleSection,
  ARTICLE_OVERLAY_COLOUR_OPTIONS,
  ARTICLE_SECTION_OPTIONS,
} from "@/lib/constants/articleConstants";
import mongoose, { Document } from "mongoose";

export interface ArticleBase {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  imageUrl: string;
  slug: string;
  section: ArticleSection;
  overlayColour: ArticleOverlayColour;
}

export interface ArticleDB extends Document, ArticleBase {
  author: mongoose.Schema.Types.ObjectId;
  artwork: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const articleContentSchema = new mongoose.Schema<ArticleDB>(
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
      enum: ARTICLE_SECTION_OPTIONS,
    },
    overlayColour: {
      type: String,
      required: true,
      enum: ARTICLE_OVERLAY_COLOUR_OPTIONS,
    },
  },
  {
    collection: "articles",
    timestamps: true,
  }
);

const ArticleModel =
  mongoose.models.Article ||
  mongoose.model<ArticleDB>("Article", articleContentSchema);

export { ArticleModel };
