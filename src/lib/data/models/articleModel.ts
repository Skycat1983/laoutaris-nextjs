import mongoose, { Document } from "mongoose";
import { OverlayColour, Section } from "../types";

export interface BaseArticle {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  imageUrl: string;
  slug: string;
  section: Section;
  overlayColour: OverlayColour;
}

export interface ArticleDB extends Document, BaseArticle {
  author: mongoose.Schema.Types.ObjectId;
  artwork: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type LeanArticle = Omit<ArticleDB, keyof Document> & {
  _id: string;
  author: string;
  artwork: string;
  createdAt: Date;
  updatedAt: Date;
};

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
  mongoose.model<ArticleDB>("Article", articleContentSchema);

export { ArticleModel };
