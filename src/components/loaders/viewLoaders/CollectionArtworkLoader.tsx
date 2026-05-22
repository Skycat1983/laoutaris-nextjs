import { ArtworkView } from "@/components/views";
import { getCollectionArtwork } from "@/lib/data/services/getCollectionArtwork";
import {
  getArtworkShopProducts,
  type ArtworkShopProducts,
} from "@/lib/data/services/getArtworkShopProducts";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";
import { notFound } from "next/navigation";

const logger = createServerLogger({
  component: "CollectionArtworkLoader",
  operation: "public.collection_artwork.loader",
  surface: "server_loader",
});

const emptyArtworkShopProducts = (): ArtworkShopProducts => ({
  original: null,
  prints: [],
  books: [],
});

export async function CollectionArtworkLoader({
  slug,
  artworkId,
}: {
  slug: string;
  artworkId: string;
}) {
  const result = await getCollectionArtwork(slug, artworkId).catch((error) => {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("loader.public.collection_artwork.failed", {
      error,
      slug,
      hasArtworkId: Boolean(artworkId),
    });
    throw new Error("Failed to fetch collection artwork");
  });

  if (result.status !== "found") {
    notFound();
  }

  const { artworks } = result.collection;
  const artwork = artworks[0];
  let shopProducts: ArtworkShopProducts;

  try {
    shopProducts = await getArtworkShopProducts(artwork.shopifyProducts);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    logger.error("loader.public.collection_artwork.shop_products.failed", {
      error,
      slug,
      hasArtworkId: Boolean(artworkId),
    });
    shopProducts = emptyArtworkShopProducts();
  }

  return (
    <>
      <ArtworkView {...artwork} shopProducts={shopProducts} />
    </>
  );
}
