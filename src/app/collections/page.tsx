import { serverApi } from "@/lib/api/serverApi";
import { CollectionNavItem } from "@/lib/data/types/navigationTypes";
import { buildUrl } from "@/lib/utils/buildUrl";
import { redirect } from "next/navigation";

export default async function Collections() {
  try {
    // Fetch the list of collections
    const result: ApiResponse<CollectionNavItem[]> =
      await serverApi.public.navigation.fetchCollectionNavigationList();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch collections");
    }

    const { data: collections } = result as ApiSuccessResponse<
      CollectionNavItem[]
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
      firstCollection.artworkId,
    ]);

    // Redirect to the first collection's first artwork
    return redirect(defaultRedirectPath);
  } catch (error) {
    console.error("Error in collections default path:", error);
    throw error; // Let Next.js error boundary handle it
  }
}
