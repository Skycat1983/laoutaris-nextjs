import React from "react";
import ArtworkLoader from "@/components/loaders/viewLoaders/ArtworkLoader";

const ArtworkView = ({ params }: { params: { artworkId: string } }) => {
  return <ArtworkLoader params={{ id: params.artworkId }} />;
};

export default ArtworkView;
