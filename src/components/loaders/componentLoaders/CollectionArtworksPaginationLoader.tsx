import { buildUrl } from "@/lib/utils/urlUtils";

import { ScrollableArtworkPagination } from "@/components/modules/pagination/ScrollableArtworkPagination";
import type { ArtworkFrontend } from "@/lib/data/types";
import { getCollectionWithArtworks } from "@/lib/data/services/getCollectionWithArtworks";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";

const logger = createServerLogger({
  component: "CollectionArtworksPaginationLoader",
  operation: "public.collection_artworks_pagination.loader",
  surface: "server_loader",
});

interface CollectionArtworksPaginationLoaderProps {
  slug: string;
}

export async function CollectionArtworksPaginationLoader({
  slug,
}: CollectionArtworksPaginationLoaderProps) {
  try {
    const data = await getCollectionWithArtworks(slug);
    if (!data) {
      throw new Error("Failed to fetch collection artworks navigation");
    }

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
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    logger.error("loader.public.collection_artworks_pagination.failed", {
      error,
      slug,
    });
    return null;
  }
}
