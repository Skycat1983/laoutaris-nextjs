import mongoose from "mongoose";
import { BaseModel } from "./base";

const articleSchema = new mongoose.Schema({
  overlayColour: {
    type: String,
    required: true,
    enum: ["white", "black"],
  },
});

const ArticleModel =
  BaseModel.discriminators?.["Article"] ||
  BaseModel.discriminator("Article", articleSchema);

export { ArticleModel };
