import { SubscribeSection } from "@/components/sections";
import { ArtworkView } from "@/components/views";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import { getArtworkShopProducts } from "@/lib/data/services/getArtworkShopProducts";
import { isNextError } from "@/lib/helpers/isNextError";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import React from "react";

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
    throw new Error("Failed to fetch artwork");
  }

  const shopProducts = await getArtworkShopProducts(data.shopifyProducts);

  return (
    <>
      <div className="py-16">
        <ArtworkView {...data} shopProducts={shopProducts} />
      </div>
      {/* <CollectionInfoLayout /> */}
      <div className="pt-16">
        <SubscribeSection isLoggedIn={false} />
      </div>
    </>
  );
};

export default ArtworkLoader;
