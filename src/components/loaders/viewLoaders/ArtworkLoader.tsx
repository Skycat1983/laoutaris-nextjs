import CollectionInfoLayout from "@/components/layouts/public/CollectionInfoLayout";
import { SubscribeSection } from "@/components/sections";
import { ArtworkView } from "@/components/views";
import { serverApi } from "@/lib/api/serverApi";
import {
  artworkToPublic,
  PublicArtwork,
} from "../../../../unused/artworkToPublic";
import React from "react";

const ArtworkLoader = async ({ params }: { params: { id: string } }) => {
  const result = await serverApi.public.artwork.single(params.id);
  if (!result.success) {
    throw new Error("Failed to fetch artwork");
  }
  const { data: artwork } = result;
  return (
    <>
      <div className="py-16">
        <ArtworkView {...artwork} />
      </div>
      {/* <CollectionInfoLayout /> */}
      <div className="pt-16">
        <SubscribeSection isLoggedIn={false} />
      </div>
    </>
  );
};

export default ArtworkLoader;
