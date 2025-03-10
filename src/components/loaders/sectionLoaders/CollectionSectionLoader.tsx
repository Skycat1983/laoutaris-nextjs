"use server";

import { transformToPick } from "@/lib/transforms/transformToPick";
import { Collection } from "@/lib/data/types/collectionTypes";
import { CollectionSection } from "@/components/sections/CollectionSection";
import { delay } from "@/lib/utils/debug";
import { serverApi } from "@/lib/api/serverApi";
import { ApiSuccessResponse } from "@/lib/data/types/apiTypes";

// Config Constants
const COLLECTIONS_FETCH_CONFIG = {
  section: "collections",
  // fields: ["title", "slug", "imageUrl", "artworks"] as const,
} as const;

// Type Definitions
export type CollectionCardData = Pick<
  Collection,
  "title" | "imageUrl" | "slug" | "artworks"
>;

// Loader Function
export async function CollectionsSectionLoader() {
  await delay(2000);
  try {
    // Fetch data using API layer
    const result = await serverApi.public.collection.multiple({
      section: COLLECTIONS_FETCH_CONFIG.section,
      // fields: COLLECTIONS_FETCH_CONFIG.fields,
      limit: 9,
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch collections");
    }

    const { data: collections } = result as ApiSuccessResponse<Collection[]>;

    // Return component with transformed data
    return <CollectionSection collections={collections} />;
  } catch (error) {
    console.error("Collections section loading failed:", error);
    return null;
  }
}
