import mongoose from "mongoose";
import { ContentModel } from "./content";

const articleSchema = new mongoose.Schema({
  overlayColour: {
    type: String,
    required: true,
    enum: ["white", "black"],
  },
});

const ArticleModel =
  ContentModel.discriminators?.["Article"] ||
  ContentModel.discriminator("Article", articleSchema);

export { ArticleModel };
