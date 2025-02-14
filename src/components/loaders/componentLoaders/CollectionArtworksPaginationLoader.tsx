import { CollectionPagination } from "@/components/modules/pagination/CollectionViewPagination";
import { fetchCollectionArtworksNavigation } from "@/lib/api/public/navigationApi";

interface CollectionArtworksPaginationLoaderProps {
  slug: string;
}

export async function CollectionArtworksPaginationLoader({
  slug,
}: CollectionArtworksPaginationLoaderProps) {
  const paginationArtwork = await fetchCollectionArtworksNavigation(slug);

  return <CollectionPagination items={paginationArtwork} slug={slug} />;
}
