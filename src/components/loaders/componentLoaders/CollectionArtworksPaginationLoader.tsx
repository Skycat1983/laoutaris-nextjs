import { buildUrl } from "@/lib/utils/buildUrl";

import { ScrollableArtworkPagination } from "@/components/modules/pagination/ScrollableArtworkPagination";
import { ArtworkFrontend } from "@/lib/data/types";
import { serverApi } from "@/lib/api/serverApi";
import { ApiCollectionArtworkNavListResult } from "@/lib/api/public/navigation/fetchers";

interface CollectionArtworksPaginationLoaderProps {
  slug: string;
}

export async function CollectionArtworksPaginationLoader({
  slug,
}: CollectionArtworksPaginationLoaderProps) {
  const result =
    await serverApi.public.navigation.fetchCollectionArtworksNavigation(slug);

  if (!result.success) {
    throw new Error(
      result.error || "Failed to fetch collection artworks navigation"
    );
  }

  const { data } = result as ApiCollectionArtworkNavListResult;

  const buildCollectionLink = (artwork: ArtworkFrontend) =>
    buildUrl(["collections", slug, artwork._id]);

  const itemsWithLinks = data.map((artwork) => ({
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
