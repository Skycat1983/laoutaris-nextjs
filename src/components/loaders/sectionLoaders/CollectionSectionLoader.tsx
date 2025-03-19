"use server";

import { CollectionSection } from "@/components/sections/CollectionSection";
import { delay } from "@/lib/utils/debug";
import { serverApi } from "@/lib/api/serverApi";
import { ApiSuccessResponse } from "@/lib/data/types/apiTypes";
import { CollectionFrontend } from "@/lib/data/types/collectionTypes";
import { isNextError } from "@/lib/helpers/isNextError";
// Loader Function
export async function CollectionsSectionLoader() {
  try {
    // Fetch data using API layer
    const result = await serverApi.public.collection.multiple({
      section: "collections",
      limit: 9,
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch collections");
    }

    const { data: collections } = result as ApiSuccessResponse<
      CollectionFrontend[]
    >;

    // Return component with transformed data
    return <CollectionSection collections={collections} />;
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Collections section loading failed:", error);
    return null;
  }
}
