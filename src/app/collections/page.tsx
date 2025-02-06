import { fetchCollectionNavigationList } from "@/lib/api/navigationApi";
import { buildUrl } from "@/utils/buildUrl";
import { redirect } from "next/navigation";

/**
 * Collections Page Route
 *
 * Handles the `/collections` route by redirecting to the first available collection's first artwork.
 *
 * @route GET /collections
 *
 * Flow:
 * 1. Fetches list of collection navigation items
 * 2. Redirects to the first collection's path with its first artwork ID
 *
 * Error Handling:
 * - Throws if no collections are found
 * - Throws if API request fails
 * - Handled by Next.js error boundary
 *
 * @throws {Error} When no collections are found or API fails
 */
export default async function Collections() {
  try {
    // Fetch the list of collections
    const collections = await fetchCollectionNavigationList("collections");

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
