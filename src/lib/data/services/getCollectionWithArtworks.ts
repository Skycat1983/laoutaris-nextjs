import "server-only";

import { CollectionModel } from "@/lib/data/models/collectionModel";
import type {
  CollectionFrontendPopulated,
  CollectionLeanPopulated,
} from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";
import { transformCollectionPopulated } from "@/lib/transforms";

export const getCollectionWithArtworks = async (
  slug: string
): Promise<CollectionFrontendPopulated | null> => {
  await dbConnect();

  const rawCollection = await CollectionModel.findOne({
    slug,
  })
    .populate<CollectionLeanPopulated>("artworks")
    .lean<CollectionLeanPopulated>();

  if (!rawCollection) {
    return null;
  }

  return transformCollectionPopulated(rawCollection);
};
