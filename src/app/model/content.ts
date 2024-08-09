import mongoose from "mongoose";

// this is the base schema for all article/collection types
const baseOptions = {
  discriminatorKey: "contentType", // our discriminator key
  collection: "content", // name of the collection in MongoDB
  timestamps: true, // automatically include createdAt and updatedAt
};

const baseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    summary: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    imageUrl: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    // section: { type: String, required: true },
    section: {
      type: String,
      required: true,
      enum: ["artwork", "biography", "project"],
    },
  },
  baseOptions
);

const ContentModel =
  mongoose.models?.Content || mongoose.model("Content", baseSchema);

export { ContentModel };
