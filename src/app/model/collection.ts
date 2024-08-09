import mongoose from "mongoose";
import { ContentModel } from "./content.js";

const collectionSchema = new mongoose.Schema({
  criteriaKey: { type: String },
  criteriaValue: { type: String },
  artworks: [{ type: mongoose.Schema.Types.ObjectId, ref: "artwork" }],
});

const CollectionModel =
  ContentModel.discriminators?.["Collection"] ||
  ContentModel.discriminator("Collection", collectionSchema);

export { CollectionModel };
