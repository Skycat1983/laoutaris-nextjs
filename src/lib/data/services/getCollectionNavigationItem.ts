import "server-only";

import { CollectionModel } from "@/lib/data/models/collectionModel";
import type {
  CollectionNavDataFrontend,
  CollectionSelectFieldsLean,
} from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";
import { transformCollectionNav } from "@/lib/transforms/navigation/transformNavData";

export type CollectionNavigationItemServiceResult =
  CollectionNavDataFrontend | null;

export const getCollectionNavigationItem = async (
  slug: string
): Promise<CollectionNavigationItemServiceResult> => {
  await dbConnect();

  const collectionLean = await CollectionModel.findOne({
    section: "collections",
    slug,
  })
    .select("title slug artworks")
    .lean<CollectionSelectFieldsLean>();

  if (!collectionLean) {
    return null;
  }

  return transformCollectionNav.toFrontend(collectionLean);
};
