import ArtworkView from "@/components/views/ArtworkView";
import { fetchCollectionArtwork } from "@/lib/api/collectionApi";
import {
  artworkToPublic,
  PublicArtwork,
} from "@/lib/transforms/artworkToPublic";
import { FrontendCollectionWithArtworks } from "@/lib/types/collectionTypes";
import { delay } from "@/utils/debug";

export async function CollectionArtworkLoader({
  slug,
  artworkId,
}: {
  slug: string;
  artworkId: string;
}) {
  await delay(1000);
  const collectionArtwork: FrontendCollectionWithArtworks =
    await fetchCollectionArtwork(slug, artworkId);

  const publicArtwork: PublicArtwork = artworkToPublic(
    collectionArtwork.artworks[0]
  );

  return <ArtworkView {...publicArtwork} />;
}
