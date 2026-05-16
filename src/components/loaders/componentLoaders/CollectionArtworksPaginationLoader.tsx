import { buildUrl } from "@/lib/utils/urlUtils";

import { ScrollableArtworkPagination } from "@/components/modules/pagination/ScrollableArtworkPagination";
import { ArtworkFrontend } from "@/lib/data/types";
import { getCollectionWithArtworks } from "@/lib/data/services/getCollectionWithArtworks";
import { isNextError } from "@/lib/helpers/isNextError";
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
    console.error("Collection artworks pagination loading failed:", error);
    return null;
  }
}
