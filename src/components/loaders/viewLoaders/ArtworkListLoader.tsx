import { serverApi } from "@/lib/api/serverApi";
import { ArtworkGallery } from "@/components/artwork/ArtworkGallery";
import { ArtworkSortConfig } from "@/lib/data/types";
import { ArtworkFilterParams } from "@/lib/data/types/artworkTypes";
import { ApiArtworkListResult } from "@/lib/api/public/artwork/fetchers";
interface ArtworkListLoaderProps {
  initialSort?: ArtworkSortConfig;
  initialFilters?: ArtworkFilterParams;
}

export const ArtworkListLoader = async ({
  initialSort,
  initialFilters,
}: ArtworkListLoaderProps) => {
  const result = await serverApi.public.artwork.multiple({
    ...initialFilters,
    filterMode: initialFilters?.filterMode || "ALL",
    sortBy: initialSort?.by,
    sortColor: initialSort?.color,
  });

  if (!result.success) {
    console.log("result.error", result.error);
    throw new Error(result.error || "Failed to fetch artworks");
  }

  const { data: artworks, metadata } = result as ApiArtworkListResult;

  return (
    <ArtworkGallery
      initialArtworks={artworks}
      initialSort={initialSort}
      initialFilters={initialFilters}
    />
  );
};
