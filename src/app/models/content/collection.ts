import mongoose from "mongoose";
import { ContentModel, IContent } from "./baseContent.js";

// a collection is a group of artworks that share a common criteria
export interface ICollection extends IContent {
  criteriaKey?: string;
  criteriaValue?: string;
  artworks?: mongoose.Schema.Types.ObjectId[];
}

const collectionSchema = new mongoose.Schema({
  criteriaKey: { type: String },
  criteriaValue: { type: String },
  artworks: [{ type: mongoose.Schema.Types.ObjectId, ref: "artwork" }],
});

const CollectionModel =
  ContentModel.discriminators?.["Collection"] ||
  ContentModel.discriminator<IContent>("Collection", collectionSchema);

export { CollectionModel };
