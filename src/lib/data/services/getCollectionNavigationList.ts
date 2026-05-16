import "server-only";

import { CollectionModel } from "@/lib/data/models/collectionModel";
import type {
  CollectionNavDataFrontend,
  CollectionSelectFieldsLean,
  ListResult,
} from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";
import { transformCollectionNav } from "@/lib/transforms/navigation/transformNavData";

export type CollectionNavigationListServiceResult =
  ListResult<CollectionNavDataFrontend> | null;

export const getCollectionNavigationList =
  async (): Promise<CollectionNavigationListServiceResult> => {
    await dbConnect();

    const collectionsLean = await CollectionModel.find({
      section: "collections",
    })
      .select("title slug artworks")
      .sort({ updatedAt: 1 })
      .lean<CollectionSelectFieldsLean[]>()
      .maxTimeMS(30000);

    if (!collectionsLean.length) {
      return null;
    }

    const collectionNavData = collectionsLean.map((collection) =>
      transformCollectionNav.toFrontend(collection)
    );

    return {
      success: true,
      data: collectionNavData,
      metadata: {
        total: collectionNavData.length,
        page: 1,
        limit: collectionNavData.length,
        totalPages: 1,
      },
    };
  };
