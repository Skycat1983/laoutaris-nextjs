"use server";

import { fetchCollectionNavigationItem } from "@/lib/api/navigationApi";
import { buildUrl } from "@/utils/buildUrl";
import { redirect } from "next/navigation";

/**
 * Collection Slug Page Route
 *
 * Handles the `/collections/[slug]` route by redirecting to the collection's first artwork.
 *
 * @route GET /collections/[slug]
 *
 * Flow:
 * 1. Fetches single collection navigation item by slug
 * 2. Redirects to the collection's path with its first artwork ID
 *
 * Error Handling:
 * - Throws if collection not found
 * - Throws if API request fails
 * - Handled by Next.js error boundary
 *
 * @param {Object} params - Route parameters
 * @param {string} params.slug - Collection slug
 */
export default async function CollectionSlug({
  params,
}: {
  params: { slug: string };
}) {
  try {
    // Fetch the specific collection
    const collection = await fetchCollectionNavigationItem(params.slug);

    // Build and redirect to the full path
    const redirectPath = buildUrl([
      "collections",
      collection.slug,
      collection.artworkId,
    ]);

    return redirect(redirectPath);
  } catch (error) {
    console.error("Error in collection slug redirect:", error);
    throw error; // Let Next.js error boundary handle it
  }
}
