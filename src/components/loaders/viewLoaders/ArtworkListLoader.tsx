import { ArtworkGallery } from "@/components/artwork/ArtworkGallery";
import type { ArtworkSortConfig } from "@/lib/data/types";
import type { ArtworkFilterParams } from "@/lib/data/types/artworkTypes";
import { getArtworkList } from "@/lib/data/services/getArtworkList";

interface ArtworkListLoaderProps {
  initialSort?: ArtworkSortConfig;
  initialFilters?: ArtworkFilterParams;
}

export const ArtworkListLoader = async ({
  initialSort,
  initialFilters,
}: ArtworkListLoaderProps) => {
  const { data: artworks } = await getArtworkList({
    ...initialFilters,
    filterMode: initialFilters?.filterMode || "ALL",
    sortBy: initialSort?.by,
    sortColor: initialSort?.color,
  });

  return (
    <ArtworkGallery
      startingArtworks={artworks}
      sortDefaults={initialSort}
      filterDefaults={initialFilters}
    />
  );
};
