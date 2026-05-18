"use server";

import { CollectionSection } from "@/components/sections/CollectionSection";
import { getCollectionList } from "@/lib/data/services/getCollectionList";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";

const logger = createServerLogger({
  component: "CollectionsSectionLoader",
  operation: "public.collections_section.loader",
  surface: "server_loader",
});

// Loader Function
export async function CollectionsSectionLoader() {
  try {
    const result = await getCollectionList({
      section: "collections",
      limit: 9,
    });

    if (!result) {
      throw new Error("No collections found");
    }

    return <CollectionSection collections={result.data} />;
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    logger.error("loader.public.collections_section.failed", { error });
    return null;
  }
}
