import React, { Suspense } from "react";
import ArtworkLoader from "@/components/loaders/viewLoaders/ArtworkLoader";
import ArtworkViewSkeleton from "@/components/elements/skeletons/ArtworkViewSkeleton";

const ArtworkView = ({ params }: { params: { artworkId: string } }) => {
  return (
    <>
      <Suspense fallback={<ArtworkViewSkeleton />}>
        <ArtworkLoader params={{ id: params.artworkId }} />;
      </Suspense>
    </>
  );
};

export default ArtworkView;
