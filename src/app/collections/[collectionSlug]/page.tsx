"use server";

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
import { IFrontendCollectionUnpopulated } from "@/lib/client/types/collectionTypes";
import { fetchCollections } from "@/lib/server/collection/data-fetching/fetchCollections";
import { buildUrl } from "@/utils/buildUrl";
import { redirect } from "next/navigation";

type CollectionFields = Pick<
  IFrontendCollectionUnpopulated,
  "artworks" | "slug"
>;

export default async function CollectionSlug({
  params,
}: {
  params: { collectionSlug: string };
}) {
  await dbConnect();
  const stem = "collections";

  const collectionSlug = params.collectionSlug;
  const identifierKey = "slug";
  const identifierValue = collectionSlug;
  const fields = ["artworks", "slug"];

  const response = await fetchCollections<CollectionFields[]>(
    identifierKey,
    identifierValue,
    fields
  );

  if (!response.success) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between px-8 lg:px-24 py-4">
        <h1 className="text-3xl font-bold">Collection</h1>
        <p className="mt-4">This collection is currently unavailable.</p>
        <p className="mt-4">{response.message}</p>
      </main>
    );
  }
  const { data } = response;

  const firstArtwork = data[0].artworks[0];

  const url = buildUrl([stem, collectionSlug, firstArtwork]);
  redirect(url);
}

//! old working code

// type CollectionFields = Pick<
//   IFrontendCollectionUnpopulated,
//   "artworks" | "slug"
// >;

// export default async function CollectionSlug({
//   params,
// }: {
//   params: { collectionSlug: string };
// }) {
//   await dbConnect();
//   const stem = "collections";

//   const collectionSlug = params.collectionSlug;
//   const identifierKey = "slug";
//   const identifierValue = collectionSlug;
//   const fields = ["artworks", "slug"];

//   const response = await fetchCollections<CollectionFields[]>(
//     identifierKey,
//     identifierValue,
//     fields
//   );

//   if (!response.success) {
//     return (
//       <main className="flex min-h-screen flex-col items-center justify-between px-8 lg:px-24 py-4">
//         <h1 className="text-3xl font-bold">Collection</h1>
//         <p className="mt-4">This collection is currently unavailable.</p>
//         <p className="mt-4">{response.message}</p>
//       </main>
//     );
//   }
//   const { data } = response;

//   const firstArtwork = data[0].artworks[0];

//   const url = buildUrl([stem, collectionSlug, firstArtwork]);
//   redirect(url);
// }
