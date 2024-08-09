import mongoose from "mongoose";
import { BaseModel } from "./base.js";

const collectionSchema = new mongoose.Schema({
  criteriaKey: { type: String },
  criteriaValue: { type: String },
  artworks: [{ type: mongoose.Schema.Types.ObjectId, ref: "artwork" }],
});

const CollectionModel =
  BaseModel.discriminators?.["Collection"] ||
  BaseModel.discriminator("Collection", collectionSchema);

export { CollectionModel };
