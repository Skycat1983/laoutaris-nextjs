import mongoose from "mongoose";
import { BaseContentModel } from "./base";

const articleSchema = new mongoose.Schema({
  overlayColour: {
    type: String,
    required: true,
    enum: ["white", "black"],
  },
});
export const ArticleModel = BaseContentModel.discriminator(
  "Article",
  articleSchema
);
