"use server";

import { getCollectionSlugDefaultExtensionPath } from "@/lib/server/collection/use_cases/getCollectionSlugDefaultExtensionPath";
/**
 * @fileoverview
 * This Next.js page manages the `/artwork/collectionSlug` path.
 *
 * - **Purpose:**
 *   The `/artwork/collection` route serves as an intermediary that should not be directly accessible via site links.
 *   If a user navigates to this route with a valid `collectionSlug`, it automatically redirects them to the first artwork
 *   within the specified collection, following the path pattern `/artwork/collection-slug/artworkId`.
 *
 * - **Project Structure:**
 *   - **Path Pattern:** `/artwork/collection-slug/artworkId`
 *   - **Behavior:**
 *     Accessing `/artwork/collection-slug` forwards the user to `/artwork/collection-slug/artworkId` based on the first available artwork.
 *
 * - **Error Handling:**
 *   If the specified collection does not exist or contains no artworks, it displays a user-friendly error message.
 *   TODO: Implement more robust error handling and fallback mechanisms.
 *
 * - **Dependencies:**
 *   Utilizes `fetchCollections` to retrieve collection data from MongoDB and `buildUrl` for constructing redirect URLs.
 *   Employs `redirect` from `next/navigation` to perform client-side navigation.
 */
import dbConnect from "@/utils/mongodb";
import { redirect } from "next/navigation";

export default async function CollectionSlug({
  params,
}: {
  params: { collectionSlug: string };
}) {
  await dbConnect();
  const slug = params.collectionSlug;
  const defaultRedirectPath = await getCollectionSlugDefaultExtensionPath(slug);
  console.log("defaultRedirectPath in CollectionSlug", defaultRedirectPath);
  redirect(defaultRedirectPath);
}
