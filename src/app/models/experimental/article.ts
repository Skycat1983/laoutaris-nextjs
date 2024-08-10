import mongoose from "mongoose";
import { ContentModel, IContent } from "./baseContent";

export interface IArticle extends IContent {
  overlayColour: "white" | "black";
}

const articleSchema = new mongoose.Schema({
  overlayColour: {
    type: String,
    required: true,
    enum: ["white", "black"],
  },
});

const ArticleModel =
  ContentModel.discriminators?.["Article"] ||
  ContentModel.discriminator<IArticle>("Article", articleSchema);

export { ArticleModel };
