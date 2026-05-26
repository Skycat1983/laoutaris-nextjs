import { SubscribeSection } from "@/components/sections/SubscribeSection";
import { ArtworkView } from "@/components/views/ArtworkView";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import {
  getArtworkShopProducts,
  type ArtworkShopProducts,
} from "@/lib/data/services/getArtworkShopProducts";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { notFound } from "next/navigation";
import React from "react";

const logger = createServerLogger({
  component: "ArtworkLoader",
  operation: "public.artwork.loader",
  surface: "server_loader",
});

const emptyArtworkShopProducts = (): ArtworkShopProducts => ({
  original: null,
  prints: [],
  books: [],
});

const ArtworkLoader = async ({ params }: { params: { id: string } }) => {
  let data: Awaited<ReturnType<typeof getArtworkById>>;

  try {
    const userId = await getUserIdFromSession();
    data = await getArtworkById(params.id, userId);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    throw new Error("Failed to fetch artwork");
  }

  if (!data) {
    notFound();
  }

  let shopProducts: ArtworkShopProducts;

  try {
    shopProducts = await getArtworkShopProducts(data.shopifyProducts);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("loader.public.artwork.shop_products.failed", {
      error,
      hasArtworkId: Boolean(params.id),
    });
    shopProducts = emptyArtworkShopProducts();
  }

  return (
    <>
      <div className="py-16">
        <ArtworkView {...data} shopProducts={shopProducts} />
      </div>
      <div className="pt-16">
        <SubscribeSection isLoggedIn={false} />
      </div>
    </>
  );
};

export default ArtworkLoader;
