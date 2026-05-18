import type { Metadata } from "next";
import { CollectionArtworkLoader } from "@/components/loaders/viewLoaders/CollectionArtworkLoader";
import ArtworkViewSkeleton from "@/components/elements/skeletons/ArtworkViewSkeleton";
import { CollectionArtworkStructuredData } from "@/components/metadata/PublicDetailJsonLd";
import { getCollectionArtwork } from "@/lib/data/services/getCollectionArtwork";
import {
  buildCollectionArtworkDetailMetadata,
  buildMissingPublicDetailMetadata,
  buildUnavailablePublicDetailMetadata,
} from "@/lib/metadata/publicDetailMetadata";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

type CollectionArtworkPageProps = {
  params: { slug: string; artworkId: string };
};

export async function generateMetadata({
  params,
}: CollectionArtworkPageProps): Promise<Metadata> {
  try {
    const result = await getCollectionArtwork(params.slug, params.artworkId);

    if (result.status !== "found") {
      return buildMissingPublicDetailMetadata("Artwork");
    }

    return buildCollectionArtworkDetailMetadata(result.collection);
  } catch {
    return buildUnavailablePublicDetailMetadata("Artwork");
  }
}

export default async function ArtworkId({
  params,
}: CollectionArtworkPageProps) {
  const { slug, artworkId } = params;

  return (
    <main>
      <Suspense fallback={null}>
        <CollectionArtworkStructuredData slug={slug} artworkId={artworkId} />
      </Suspense>
      <Suspense fallback={<ArtworkViewSkeleton />}>
        <CollectionArtworkLoader slug={slug} artworkId={artworkId} />
      </Suspense>
    </main>
  );
}
