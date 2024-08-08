import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  summary: { type: String, required: true },
  text: { type: String, required: true },
  imageUrl: { type: String, required: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  slug: { type: String, required: true, unique: true },
  //! below fields are just for blog entries.s
  displayDate: { type: Date, required: true },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
  // likes: { type: Number, default: 0 },
  // comments: [
  //   {
  //     user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  //     text: { type: String },
  //     date: { type: Date, default: Date.now },
  //   },
  // ],
});

export const BlogModel = mongoose.model("blog", blogSchema);
