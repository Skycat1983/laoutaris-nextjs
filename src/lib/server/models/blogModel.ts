import mongoose, { Document } from "mongoose";

export interface DBBlogEntry extends Document {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  imageUrl: string;
  author: mongoose.Schema.Types.ObjectId;
  slug: string;
  displayDate: Date;
  featured: boolean;
  pinned: boolean;
  tags: string[];
  comments: mongoose.Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const blogSchema = new mongoose.Schema<DBBlogEntry>(
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
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const BlogModel =
  mongoose.models.Blog || mongoose.model<DBBlogEntry>("Blog", blogSchema);

export { BlogModel };

// likes: { type: Number, default: 0 },
// comments: [
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
//     text: { type: String },
//     date: { type: Date, default: Date.now },
//   },
// ],
