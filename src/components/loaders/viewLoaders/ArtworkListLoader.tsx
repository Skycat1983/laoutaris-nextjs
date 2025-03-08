import { serverApi } from "@/lib/api/serverApi";
import { ArtworkGallery } from "@/components/artwork/ArtworkGallery";
import { ArtworkSortConfig } from "@/lib/data/types";
import { ArtworkFilterParams } from "@/lib/data/types/artworkTypes";

interface ArtworkListLoaderProps {
  initialSort?: ArtworkSortConfig;
  initialFilters?: ArtworkFilterParams;
}

export const ArtworkListLoader = async ({
  initialSort,
  initialFilters,
}: ArtworkListLoaderProps) => {
  const initialArtworks = await serverApi.public.artwork.multiple({
    ...initialFilters,
    filterMode: initialFilters?.filterMode || "ALL",
    sortBy: initialSort?.by,
    sortColor: initialSort?.color,
  });

  if (!initialArtworks.success) {
    throw new Error("No artworks found");
  }

  const { data: artworks, metadata } = initialArtworks;

  return (
    <ArtworkGallery
      initialArtworks={artworks}
      initialSort={initialSort}
      initialFilters={initialFilters}
    />
  );
};
