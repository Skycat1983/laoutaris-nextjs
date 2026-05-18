import React, { Suspense } from "react";
import type { Metadata } from "next";
import ArtworkLoader from "@/components/loaders/viewLoaders/ArtworkLoader";
import ArtworkViewSkeleton from "@/components/elements/skeletons/ArtworkViewSkeleton";
import { ArtworkStructuredData } from "@/components/metadata/PublicDetailJsonLd";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import {
  buildArtworkDetailMetadata,
  buildMissingPublicDetailMetadata,
  buildUnavailablePublicDetailMetadata,
} from "@/lib/metadata/publicDetailMetadata";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type ArtworkPageProps = {
  params: { artworkId: string };
};

export async function generateMetadata({
  params,
}: ArtworkPageProps): Promise<Metadata> {
  try {
    const artwork = await getArtworkById(params.artworkId);

    if (!artwork) {
      return buildMissingPublicDetailMetadata("Artwork");
    }

    return buildArtworkDetailMetadata(artwork);
  } catch {
    return buildUnavailablePublicDetailMetadata("Artwork");
  }
}

const ArtworkView = ({ params }: ArtworkPageProps) => {
  // Validate that artworkId looks like a MongoDB ObjectId (24 hex characters)
  // This prevents browser source map requests (e.g., "installHook.js.map") from hitting the API
  const isValidObjectId = /^[a-f\d]{24}$/i.test(params.artworkId);

  if (!isValidObjectId) {
    notFound();
  }

  return (
    <main>
      <Suspense fallback={null}>
        <ArtworkStructuredData artworkId={params.artworkId} />
      </Suspense>
      <Suspense fallback={<ArtworkViewSkeleton />}>
        <ArtworkLoader params={{ id: params.artworkId }} />;
      </Suspense>
    </main>
  );
};

export default ArtworkView;
