import { buildUrl } from "@/lib/utils/buildUrl";

import { ScrollableArtworkPagination } from "@/components/modules/pagination/ScrollableArtworkPagination";
import { ArtworkFrontend } from "@/lib/data/types";
import { serverApi } from "@/lib/api/serverApi";
import { ApiCollectionPopulatedResult } from "@/lib/api/public/collection/fetchers";

interface CollectionArtworksPaginationLoaderProps {
  slug: string;
}

type PaginationLoaderResult = Awaited<
  ReturnType<typeof serverApi.public.collection.singleCollectionAllArtwork>
>;

export async function CollectionArtworksPaginationLoader({
  slug,
}: CollectionArtworksPaginationLoaderProps) {
  const result: PaginationLoaderResult =
    // await serverApi.public.navigation.fetchCollectionArtworksNavigation(slug);
    await serverApi.public.collection.singleCollectionAllArtwork(slug);
  if (!result.success) {
    throw new Error(
      result.error || "Failed to fetch collection artworks navigation"
    );
  }

  const { data } = result as ApiCollectionPopulatedResult;

  const buildCollectionLink = (artwork: ArtworkFrontend) =>
    buildUrl(["collections", slug, artwork._id]);

  const itemsWithLinks = data.artworks.map((artwork) => ({
    ...artwork,
    link: buildCollectionLink(artwork),
  }));

  return (
    <>
      <ScrollableArtworkPagination
        items={itemsWithLinks}
        heading="More from this collection"
      />
      <div className="h-16"></div>
    </>
  );
}
