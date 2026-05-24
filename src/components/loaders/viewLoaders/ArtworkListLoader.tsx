import { ArtworkGallery } from "@/components/artwork/ArtworkGallery";
import type { ArtworkSortConfig } from "@/lib/data/types";
import type { ArtworkFilterParams } from "@/lib/data/types/artworkTypes";
import { getCachedDefaultArtworkList } from "@/lib/data/services/getCachedArtworkListData";
import { getArtworkList } from "@/lib/data/services/getArtworkList";

interface ArtworkListLoaderProps {
  initialSort?: ArtworkSortConfig;
  initialFilters?: ArtworkFilterParams;
}

const hasNoFilterValues = (values?: readonly string[]) =>
  values === undefined || values.length === 0;

const shouldUseDefaultArtworkCache = (
  initialSort?: ArtworkSortConfig,
  initialFilters?: ArtworkFilterParams
) => {
  const sortBy = initialSort?.by ?? "mostRecent";
  const page = initialFilters?.page ?? 1;
  const limit = initialFilters?.limit ?? 10;
  const filterMode = initialFilters?.filterMode ?? "ALL";

  return (
    sortBy === "mostRecent" &&
    initialSort?.color === undefined &&
    page === 1 &&
    limit === 10 &&
    filterMode === "ALL" &&
    hasNoFilterValues(initialFilters?.decade) &&
    hasNoFilterValues(initialFilters?.artstyle) &&
    hasNoFilterValues(initialFilters?.medium) &&
    hasNoFilterValues(initialFilters?.surface)
  );
};

export const ArtworkListLoader = async ({
  initialSort,
  initialFilters,
}: ArtworkListLoaderProps) => {
  const { data: artworks } = shouldUseDefaultArtworkCache(
    initialSort,
    initialFilters
  )
    ? await getCachedDefaultArtworkList()
    : await getArtworkList({
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
