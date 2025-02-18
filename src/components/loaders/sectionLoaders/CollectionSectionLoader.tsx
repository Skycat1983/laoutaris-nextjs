"use server";

import { transformToPick } from "@/lib/transforms/transformToPick";
import { FrontendCollection } from "@/lib/data/types/collectionTypes";
import { fetchCollections } from "@/lib/api/public/collectionApi";
import { CollectionSection } from "@/components/sections/CollectionSection";
import { delay } from "@/lib/utils/debug";

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
    const collections = await fetchCollections({
      section: COLLECTIONS_FETCH_CONFIG.section,
      fields: COLLECTIONS_FETCH_CONFIG.fields,
      limit: 9,
    });

    // console.log("collections in loader", collections);

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
