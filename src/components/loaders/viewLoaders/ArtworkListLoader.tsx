import { serverApi } from "@/lib/api/serverApi";
import { ArtworkGallery } from "@/components/artwork/ArtworkGallery";
import { artworkToPublic } from "@/lib/transforms/artworkToPublic";

export const ArtworkListLoader = async () => {
  const initialArtworks = await serverApi.public.artwork.fetchArtworks();
  if (!initialArtworks.success) {
    throw new Error("No artworks found");
  }

  const publicArtworks = initialArtworks.data.map((artwork) =>
    artworkToPublic(artwork)
  );

  return <ArtworkGallery initialArtworks={publicArtworks} />;
};
