import "server-only";

import { CollectionModel } from "@/lib/data/models/collectionModel";
import type { CollectionFrontendPopulated } from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";
import { Types } from "mongoose";

export type CollectionArtworkServiceResult =
  | {
      status: "found";
      collection: CollectionFrontendPopulated;
    }
  | {
      status: "collection-not-found";
      collection: null;
    }
  | {
      status: "artwork-not-found";
      collection: null;
    };

export const getCollectionArtwork = async (
  slug: string,
  artworkId: string
): Promise<CollectionArtworkServiceResult> => {
  await dbConnect();

  const collection = await CollectionModel.findOne({ slug }).populate({
    path: "artworks",
    match: { _id: new Types.ObjectId(artworkId) },
  });

  if (!collection) {
    return {
      status: "collection-not-found",
      collection: null,
    };
  }

  const collectionData =
    typeof collection.toJSON === "function" ? collection.toJSON() : collection;

  if (!collectionData.artworks?.length) {
    return {
      status: "artwork-not-found",
      collection: null,
    };
  }

  return {
    status: "found",
    collection: collectionData as CollectionFrontendPopulated,
  };
};
