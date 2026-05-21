"use server";

import { getCollectionList } from "@/lib/data/services/getCollectionList";
import type { CollectionFrontend } from "@/lib/data/types/collectionTypes";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";

const logger = createServerLogger({
  component: "CollectionPrototypeLoader",
  operation: "prototype.home.collection.loader",
  surface: "server_loader",
});

const COLLECTION_PROTOTYPE_FETCH_CONFIG = {
  section: "collections",
  limit: 9,
} as const;

export async function getCollectionPrototypeEntries(): Promise<
  CollectionFrontend[]
> {
  try {
    const result = await getCollectionList(COLLECTION_PROTOTYPE_FETCH_CONFIG);

    return result?.data ?? [];
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("loader.prototype.home.collection.failed", { error });
    return [];
  }
}
