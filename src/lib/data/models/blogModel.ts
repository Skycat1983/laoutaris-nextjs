import mongoose, { Document } from "mongoose";
import { BLOG_TAGS, BlogTag } from "@/lib/constants";

export interface BlogEntryBase {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  imageUrl: string;
  slug: string;
  displayDate: Date;
  featured: boolean;
  pinned: boolean;
  tags: BlogTag[];
}

export interface BlogEntryDB extends Document, BlogEntryBase {
  createdAt: Date;
  updatedAt: Date;
  author: mongoose.Schema.Types.ObjectId;
  comments: mongoose.Schema.Types.ObjectId[];
}

const blogSchema = new mongoose.Schema<BlogEntryDB>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    summary: { type: String, required: true },
    text: { type: String, required: true },
    imageUrl: { type: String, required: false },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: { type: String, required: true, unique: true },
    displayDate: { type: Date, required: true },
    featured: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    tags: [{ type: String, enum: BLOG_TAGS }],
  },
  {
    timestamps: true,
  }
);

const BlogModel =
  mongoose.models.Blog || mongoose.model<BlogEntryDB>("Blog", blogSchema);

export { BlogModel };
