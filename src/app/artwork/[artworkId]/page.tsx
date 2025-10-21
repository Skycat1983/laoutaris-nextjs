import React, { Suspense } from "react";
import ArtworkLoader from "@/components/loaders/viewLoaders/ArtworkLoader";
import ArtworkViewSkeleton from "@/components/elements/skeletons/ArtworkViewSkeleton";
import { notFound } from "next/navigation";

const ArtworkView = ({ params }: { params: { artworkId: string } }) => {
  // Validate that artworkId looks like a MongoDB ObjectId (24 hex characters)
  // This prevents browser source map requests (e.g., "installHook.js.map") from hitting the API
  const isValidObjectId = /^[a-f\d]{24}$/i.test(params.artworkId);

  if (!isValidObjectId) {
    notFound();
  }

  return (
    <>
      <Suspense fallback={<ArtworkViewSkeleton />}>
        <ArtworkLoader params={{ id: params.artworkId }} />;
      </Suspense>
    </>
  );
};

export default ArtworkView;
