/**
 * @fileoverview
 * This Next.js page manages the base `/artwork` path.
 *
 * - **Purpose:**
 *   The `/artwork` route serves as an entry point without direct content.
 *   When accessed, it automatically redirects users to the first artwork of the first collection.
 *
 * - **Project Structure:**
 *   - **Path Pattern:** `/artwork/collection-name/artworkId`
 *   - **Behavior:** Accessing `/artwork` forwards to `/artwork/family-favourites/661fd1d940f59e26cc761f00` (example).
 *
 * - **Error Handling:**
 *   If no collections or artworks are available, it displays a message.
 *   TODO: Implement user-friendly error messages or fallback UI.
 *
 * - **Dependencies:**
 *   Utilizes `fetchCollections` to retrieve collection data and `buildUrl` for constructing redirect URLs.
 */

import dbConnect from "@/utils/mongodb";
import { IFrontendCollectionUnpopulated } from "@/lib/client/types/collectionTypes";
import { fetchCollections } from "@/lib/server/collection/data-fetching/fetchCollections";
import { buildUrl } from "@/utils/buildUrl";
import { redirect } from "next/navigation";

type CollectionFields = Pick<
  IFrontendCollectionUnpopulated,
  "title" | "slug" | "artworks"
>;

export default async function Collections() {
  await dbConnect();
  const stem = "artwork";
  const identifierKey = "section";
  const identifierValue = "artwork";
  const fields = ["title", "slug", "artworks"];

  const response = await fetchCollections<CollectionFields>(
    identifierKey,
    identifierValue,
    fields
  );

  if (!response.success) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-3xl font-bold">Artwork</h1>
        <p className="mt-4">No artworks are available at the moment.</p>
        <p className="mt-4">{response.message}</p>
      </main>
    );
  }

  const { data } = response;

  const redirectUrl = buildUrl([stem, data[0].slug, data[0].artworks[0]]);
  redirect(redirectUrl);
}
