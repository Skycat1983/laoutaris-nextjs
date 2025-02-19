import { buildUrl } from "@/lib/utils/buildUrl";
import { ArtworkNavFields } from "@/lib/data/types/navigationTypes";
import { ArtworkPagination } from "@/components/modules/pagination/CollectionViewPagination";
import { serverApi } from "@/lib/api/server";

interface CollectionArtworksPaginationLoaderProps {
  slug: string;
}

export async function CollectionArtworksPaginationLoader({
  slug,
}: CollectionArtworksPaginationLoaderProps) {
  const result = await serverApi.navigation.fetchCollectionArtworksNavigation(
    slug
  );

  if (!result.success) {
    throw new Error(
      result.error || "Failed to fetch collection artworks navigation"
    );
  }

  const paginationArtwork = result.data;

  const buildCollectionLink = (artwork: ArtworkNavFields) =>
    buildUrl(["collections", slug, artwork._id]);

  console.log("paginationArtwork", paginationArtwork);
  return (
    <>
      <ArtworkPagination
        items={paginationArtwork}
        heading="More from this collection"
        link_to={buildCollectionLink}
      />
    </>
  );
}
