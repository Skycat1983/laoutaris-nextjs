import "server-only";

import type { FilterQuery } from "mongoose";
import type { CollectionSection } from "@/lib/constants";
import {
  CollectionModel,
  CollectionDB,
} from "@/lib/data/models/collectionModel";
import type { CollectionFrontend, CollectionLean, ListResult } from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";
import { transformCollection } from "@/lib/transforms/collection/transformCollection";

export interface GetCollectionListParams {
  section?: CollectionSection | string | null;
  page?: number;
  limit?: number;
}

export type CollectionListServiceResult =
  ListResult<CollectionFrontend> | null;

export const getCollectionList = async ({
  section,
  page = 1,
  limit = 10,
}: GetCollectionListParams = {}): Promise<CollectionListServiceResult> => {
  await dbConnect();

  const query: FilterQuery<CollectionDB> = {};
  if (section) {
    query.section = section;
  }

  const [leanCollections, total] = await Promise.all([
    CollectionModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<CollectionLean[] | null>(),
    CollectionModel.countDocuments(query),
  ]);

  if (!leanCollections) {
    return null;
  }

  const collections = leanCollections.map((collection) =>
    transformCollection.toFrontend(collection)
  );

  return {
    success: true,
    data: collections,
    metadata: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
