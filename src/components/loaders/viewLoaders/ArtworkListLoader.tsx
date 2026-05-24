import { ArtworkGallery } from "@/components/artwork/ArtworkGallery";
import type { ArtworkSortConfig } from "@/lib/data/types";
import type { ArtworkFilterParams } from "@/lib/data/types/artworkTypes";
import { getCachedDefaultArtworkListPage } from "@/lib/data/services/getCachedArtworkListData";
import { getArtworkList } from "@/lib/data/services/getArtworkList";

interface ArtworkListLoaderProps {
  initialSort?: ArtworkSortConfig;
  initialFilters?: ArtworkFilterParams;
}

const hasNoFilterValues = (values?: readonly string[]) =>
  values === undefined || values.length === 0;

const shouldUseDefaultArtworkCachePage = (
  initialSort?: ArtworkSortConfig,
  initialFilters?: ArtworkFilterParams
) => {
  const sortBy = initialSort?.by ?? "mostRecent";
  const page = initialFilters?.page ?? 1;
  const limit = initialFilters?.limit ?? 10;
  const filterMode = initialFilters?.filterMode ?? "ALL";

  const shouldUseCache =
    sortBy === "mostRecent" &&
    initialSort?.color === undefined &&
    page >= 1 &&
    page <= 5 &&
    limit === 10 &&
    filterMode === "ALL" &&
    hasNoFilterValues(initialFilters?.decade) &&
    hasNoFilterValues(initialFilters?.artstyle) &&
    hasNoFilterValues(initialFilters?.medium) &&
    hasNoFilterValues(initialFilters?.surface);

  return shouldUseCache ? page : undefined;
};

export const ArtworkListLoader = async ({
  initialSort,
  initialFilters,
}: ArtworkListLoaderProps) => {
  const cachedPage = shouldUseDefaultArtworkCachePage(
    initialSort,
    initialFilters
  );
  const cachedArtworkList =
    cachedPage === undefined
      ? undefined
      : await getCachedDefaultArtworkListPage(cachedPage);
  const { data: artworks } =
    cachedArtworkList ??
    (await getArtworkList({
      ...initialFilters,
      filterMode: initialFilters?.filterMode || "ALL",
      sortBy: initialSort?.by,
      sortColor: initialSort?.color,
    }));

  return (
    <ArtworkGallery
      startingArtworks={artworks}
      sortDefaults={initialSort}
      filterDefaults={initialFilters}
    />
  );
};
