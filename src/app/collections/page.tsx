import { ApiCollectionNavListResult } from "@/lib/api/public/navigation/fetchers";
import {
  ApiSuccessResponse,
  CollectionNavDataFrontend,
} from "@/lib/data/types";
import { serverApi } from "@/lib/api/serverApi";
import { ApiErrorResponse } from "@/lib/data/types";
import { redirect } from "next/navigation";
import { isNextError } from "@/lib/helpers/isNextError";
import { buildUrl } from "@/lib/utils/urlUtils";

type CollectionPageResult = ApiCollectionNavListResult | ApiErrorResponse;

export default async function Collections() {
  try {
    // Fetch the list of collections
    const result: CollectionPageResult =
      await serverApi.public.navigation.fetchCollectionNavigationList();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch collections");
    }

    const { data: collections } = result as ApiSuccessResponse<
      CollectionNavDataFrontend[]
    >;

    // If no collections found, throw an error
    if (!collections.length) {
      throw new Error("No collections found");
    }

    // Get the first collection and build the redirect path
    const firstCollection = collections[0];
    const defaultRedirectPath = buildUrl([
      "collections",
      firstCollection.slug,
      firstCollection.firstArtworkId ?? "",
    ]);

    // Redirect to the first collection's first artwork
    return redirect(defaultRedirectPath);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Error in collections default path:", error);
    throw error; // Let Next.js error boundary handle it
  }
}
