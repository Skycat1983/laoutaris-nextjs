import { buildUrl } from "@/lib/utils/buildUrl";
import { ArtworkNavFields } from "@/lib/data/types/navigationTypes";
import { ArtworkPagination } from "@/components/modules/pagination/CollectionViewPagination";
import { fetchCollectionArtworksNavigation } from "@/lib/api/public/navigationApi";

interface CollectionArtworksPaginationLoaderProps {
  slug: string;
}

export async function CollectionArtworksPaginationLoader({
  slug,
}: CollectionArtworksPaginationLoaderProps) {
  const paginationArtwork = await fetchCollectionArtworksNavigation(slug);

  const buildCollectionLink = (artwork: ArtworkNavFields) =>
    buildUrl(["collections", slug, artwork._id]);

  console.log("paginationArtwork", paginationArtwork);
  return (
    <>
      {/* <ArtworkPagination
      items={paginationArtwork}
      heading="More from this collection"
      link_to={buildCollectionLink}
    /> */}
    </>
  );
}
