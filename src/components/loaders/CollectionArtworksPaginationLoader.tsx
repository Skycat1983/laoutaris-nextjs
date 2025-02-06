import { Pagination } from "@/components/ui/pagination/Pagination";
import { fetchCollectionArtworksNavigation } from "@/lib/api/navigationApi";

interface CollectionArtworksPaginationLoaderProps {
  slug: string;
}

export async function CollectionArtworksPaginationLoader({
  slug,
}: CollectionArtworksPaginationLoaderProps) {
  const paginationArtwork = await fetchCollectionArtworksNavigation(slug);

  return <Pagination items={paginationArtwork} slug={slug} />;
}
