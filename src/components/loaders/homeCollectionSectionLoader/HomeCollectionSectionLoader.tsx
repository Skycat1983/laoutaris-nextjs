"use server";

import { transformToPick } from "@/lib/transforms/transformToPick";
import { HomeCollectionSection } from "@/components/contentSections/HomeCollectionSection";
import { FrontendCollection } from "@/lib/types/collectionTypes";
import { fetchCollections } from "@/lib/api/collectionApi";

// Config Constants
const COLLECTIONS_FETCH_CONFIG = {
  section: "artwork",
  fields: ["title", "slug", "imageUrl"] as const,
} as const;

// Type Definitions
export type CollectionCardData = Pick<
  FrontendCollection,
  "title" | "imageUrl" | "slug"
>;

// Loader Function
export async function HomeCollectionsSectionLoader() {
  try {
    // Fetch data using API layer
    const collections = await fetchCollections({
      section: COLLECTIONS_FETCH_CONFIG.section,
      fields: COLLECTIONS_FETCH_CONFIG.fields,
    });

    console.log("collections", collections);

    // Transform data using transform layer
    const collectionCards: CollectionCardData[] = collections.map((article) =>
      transformToPick(article, COLLECTIONS_FETCH_CONFIG.fields)
    );

    // Return component with transformed data
    return <HomeCollectionSection collections={collectionCards} />;
  } catch (error) {
    console.error("Collections section loading failed:", error);
    return null;
  }
}
