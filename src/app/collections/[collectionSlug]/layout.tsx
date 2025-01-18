"use server";

/**
 * @fileoverview
 * This Next.js layout component manages the `/artwork/collectionSlug` path.
 *
 * - **Purpose:**
 *   The `CollectionSlugLayout` component fetches collection data from MongoDB based on the provided `collectionSlug`.
 *   It renders pagination for artworks within the collection and displays additional collection-related information,
 *   such as the total number of artworks and an artist profile. This layout ensures that users navigate seamlessly
 *   through different artworks within the same collection.
 *
 * - **Project Structure:**
 *   - **Path Pattern:** `/artwork/collectionSlug/artworkId`
 *   - **Behavior:**
 *     - **Direct Access:** While the `/artwork/collectionSlug` path is not intended to be directly accessible via site links,
 *       if a user navigates to this route with a valid `collectionSlug`, the layout facilitates the rendering of nested
 *       artwork pages.
 *     - **Navigation:** Users can navigate between artworks within the same collection using the `ServerPagination` component.
 *     - **Consistent Information:** Collection information remains constant as users navigate between different artworks.
 *
 * - **Error Handling:**
 *   If fetching collection data fails, the component displays a fallback error message.
 *   TODO: Enhance error handling to provide more detailed feedback and fallback UI elements.
 *
 * - **Dependencies:**
 *   Utilizes `fetchCollectionArtwork` to retrieve collection data from MongoDB and `buildUrl` for constructing navigation URLs.
 *   Renders the following components with the fetched data:
 *     - `ServerPagination`: Handles pagination of artworks within the collection.
 *     - `HorizontalDivider`: Visually separates different sections of the layout.
 *     - `ArtistProfile`: Displays information about the artist.
 *     - `SubscribeForm`: Provides a form for users to subscribe for updates.
 *
 * - **Notes:**
 *   - Ensure that the `collectionSlug` corresponds to a valid collection in MongoDB to prevent unintended behavior.
 *   - The layout assumes that each collection has at least one artwork; additional checks are implemented to handle empty collections.
 */
import dbConnect from "@/utils/mongodb";
import { Suspense } from "react";
import { getCollectionArtworkPagination } from "@/lib/use_cases/getCollectionArtworkPagination";
import { PaginationArtworkLink } from "@/lib/resolvers/collectionArtworkToPaginationLink";
import { Pagination } from "@/components/ui/pagination/Pagination";

// Does this need to be here? For what reason is the pagination here and not in the page?

export default async function CollectionSlugLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { collectionSlug: string };
}) {
  await dbConnect();
  const collectionSlug = params.collectionSlug;
  const fetchAndResolve = (): Promise<PaginationArtworkLink[]> =>
    getCollectionArtworkPagination(collectionSlug);

  return (
    <section className="">
      {children}
      <Suspense fallback={<div className="w-64 h-64 bg-red-400">HELLO</div>}>
        <Pagination getData={fetchAndResolve} />
      </Suspense>
    </section>
  );
}
