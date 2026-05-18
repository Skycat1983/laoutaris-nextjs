import { ArtworkView } from "@/components/views";
import { getCollectionArtwork } from "@/lib/data/services/getCollectionArtwork";
import { getArtworkShopProducts } from "@/lib/data/services/getArtworkShopProducts";
import { isNextError } from "@/lib/helpers/isNextError";

export async function CollectionArtworkLoader({
  slug,
  artworkId,
}: {
  slug: string;
  artworkId: string;
}) {
  try {
    const result = await getCollectionArtwork(slug, artworkId);

    if (result.status !== "found") {
      throw new Error("Failed to fetch collection artwork");
    }

    const { artworks } = result.collection;
    const artwork = artworks[0];
    const shopProducts = await getArtworkShopProducts(artwork.shopifyProducts);

    return (
      <>
        <ArtworkView {...artwork} shopProducts={shopProducts} />
      </>
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Collection artwork loading failed:", error);
    return null;
  }
}
