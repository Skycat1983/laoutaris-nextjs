"use server";

import { transformToPick } from "@/lib/transforms/transformToPick";
import { FrontendCollection } from "@/lib/data/types/collectionTypes";
import { CollectionSection } from "@/components/sections/CollectionSection";
import { delay } from "@/lib/utils/debug";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";

// Config Constants
const COLLECTIONS_FETCH_CONFIG = {
  section: "collections",
  fields: ["title", "slug", "imageUrl", "artworks"] as const,
} as const;

// Type Definitions
export type CollectionCardData = Pick<
  FrontendCollection,
  "title" | "imageUrl" | "slug" | "artworks"
>;

// Loader Function
export async function CollectionsSectionLoader() {
  await delay(2000);
  try {
    // Fetch data using API layer
    const result: ApiResponse<FrontendCollection[]> =
      await serverPublicApi.collection.fetchCollections({
        section: COLLECTIONS_FETCH_CONFIG.section,
        fields: COLLECTIONS_FETCH_CONFIG.fields,
        limit: 9,
      });

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch collections");
    }

    const { data: collections } = result as ApiSuccessResponse<
      FrontendCollection[]
    >;

    // Transform data using transform layer
    const collectionCards: CollectionCardData[] = collections.map((article) =>
      transformToPick(article, COLLECTIONS_FETCH_CONFIG.fields)
    );

    // Return component with transformed data
    return <CollectionSection collections={collectionCards} />;
  } catch (error) {
    console.error("Collections section loading failed:", error);
    return null;
  }
}
