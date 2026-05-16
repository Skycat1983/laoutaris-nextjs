"use server";

import { CollectionSection } from "@/components/sections/CollectionSection";
import { getCollectionList } from "@/lib/data/services/getCollectionList";
import { isNextError } from "@/lib/helpers/isNextError";
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
    console.error("Collections section loading failed:", error);
    return null;
  }
}
