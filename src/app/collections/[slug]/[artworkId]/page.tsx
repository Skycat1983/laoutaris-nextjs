"use server";

import { CollectionArtworkLoader } from "@/components/loaders/viewLoaders/CollectionArtworkLoader";
import ArtworkViewSkeleton from "@/components/skeletons/ArtworkViewSkeleton";
import { Suspense } from "react";

export default async function ArtworkId({
  params,
}: {
  params: { slug: string; artworkId: string };
}) {
  const { slug, artworkId } = params;

  return (
    <>
      <Suspense fallback={<ArtworkViewSkeleton />}>
        <CollectionArtworkLoader slug={slug} artworkId={artworkId} />
      </Suspense>
    </>
  );
}
