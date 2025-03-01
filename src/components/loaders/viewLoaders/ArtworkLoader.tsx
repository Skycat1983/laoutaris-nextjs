import CollectionInfoLayout from "@/components/layouts/public/CollectionInfoLayout";
import { ArtworkView } from "@/components/views";
import { serverApi } from "@/lib/api/serverApi";
import {
  artworkToPublic,
  PublicArtwork,
} from "@/lib/transforms/artworkToPublic";
import React from "react";

const ArtworkLoader = async ({ params }: { params: { id: string } }) => {
  const result = await serverApi.public.artwork.fetchArtwork(params.id);
  if (!result.success) {
    throw new Error("Failed to fetch artwork");
  }
  const publicArtwork: PublicArtwork = artworkToPublic(result.data);
  return (
    <>
      <ArtworkView {...publicArtwork} />
      {/* <CollectionInfoLayout /> */}
    </>
  );
};

export default ArtworkLoader;
