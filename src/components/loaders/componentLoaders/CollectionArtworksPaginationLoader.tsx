import { buildUrl } from "@/lib/utils/buildUrl";
import {
  ArtworkNavFields,
  CollectionArtworkNavList,
} from "@/lib/data/types/navigationTypes";
import { ArtworkPagination } from "@/components/modules/pagination/CollectionViewPagination";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";

interface CollectionArtworksPaginationLoaderProps {
  slug: string;
}

export async function CollectionArtworksPaginationLoader({
  slug,
}: CollectionArtworksPaginationLoaderProps) {
  const result: ApiResponse<CollectionArtworkNavList> =
    await serverPublicApi.navigation.fetchCollectionArtworksNavigation(slug);

  if (!result.success) {
    throw new Error(
      result.error || "Failed to fetch collection artworks navigation"
    );
  }

  const { data: artworkNavigationList } =
    result as ApiSuccessResponse<CollectionArtworkNavList>;

  const { artworks } = artworkNavigationList;

  const buildCollectionLink = (artwork: ArtworkNavFields) =>
    buildUrl(["collections", slug, artwork._id]);

  return (
    <>
      <ArtworkPagination
        items={artworks}
        heading="More from this collection"
        link_to={buildCollectionLink}
      />
    </>
  );
}
