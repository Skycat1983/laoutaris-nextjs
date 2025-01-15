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
import { fetchCollectionArtwork } from "@/lib/server/collection/data-fetching/fetchCollectionArtwork";
import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import { IFrontendCollection } from "@/lib/client/types/collectionTypes";
import ArtistProfile from "@/components/atoms/ArtistProfile";
import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import SubscribeForm from "@/components/ui/forms/SubscribeForm";
import ServerPagination from "@/components/ui/serverPagination/ServerPagination";
import { Pagination } from "@/components/ui/pagination/Pagination";
import { Suspense } from "react";
import { getCollectionArtworkPagination } from "@/lib/use_cases/getCollectionArtworkPagination";

export type SelectedCollectionFields = Pick<
  IFrontendCollection,
  "artworks" | "slug" | "title"
>;
export type SelectedArtworkFields = Pick<IFrontendArtwork, "image" | "_id">;

export type CollectionArtwork = SelectedCollectionFields & {
  artworks: SelectedArtworkFields[];
};

export default async function CollectionSlugLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { collectionSlug: string };
}) {
  await dbConnect();
  const collectionSlug = params.collectionSlug;
  const fetchCollectionData = () =>
    getCollectionArtworkPagination(collectionSlug);

  return (
    <section className="">
      {/* {children} */}
      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <h1 className="px-4 py-6 text-2xl font-bold">
        More from this collection
      </h1>

      <Suspense fallback={<div className="w-64 h-64 bg-red-400">HELLO</div>}>
        <Pagination getData={fetchCollectionData} />
      </Suspense>

      {/* <ServerPagination
        artworkLinks={data.artworks}
        collectionSlug={params.collectionSlug}
      /> */}

      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <div className="flex flex-col w-full p-4 md:flex-row lg:px-24">
        <div className="flex flex-col">
          <h1 className="px-4 py-6 text-2xl font-bold">
            About this collection
          </h1>

          {/* <p className="px-4 text-primary py-8">
            There are {data.artworks.length} pieces in this collection.
          </p> */}
        </div>

        <div className="px-4 py-8 md:hidden">
          <HorizontalDivider />
        </div>
        <div className="bg-slate-800/10 w-full flex flex-col w-full">
          <ArtistProfile />
        </div>
      </div>

      <div className="px-4 py-4">
        <HorizontalDivider />
      </div>
      <div className="px-4 w-full md:w-1/2 mx-auto">
        <h1 className=" py-6 text-2xl font-bold">Subscribe for updates</h1>
        <SubscribeForm />
      </div>
      <div className="px-4 py-4">
        <HorizontalDivider />
      </div>
    </section>
  );
}

// const collectionKey = "slug";
// const collectionValue = params.collectionSlug;
// const collectionFields = ["slug", "title"];
// const artworkFields = [
//   "_id",
//   "image.secure_url",
//   "image.pixelHeight",
//   "image.pixelWidth",
// ];
// const response = await fetchCollectionArtwork<CollectionArtwork>(
//   collectionKey,
//   collectionValue,
//   collectionFields,
//   artworkFields
// );

// console.log("response in collectionLayout", response);

// if (!response.success) {
//   return <div>Failed to fetch collection data</div>;
// }
// const { data } = response;
