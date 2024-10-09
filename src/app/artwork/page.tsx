import dbConnect from "@/utils/mongodb";
import { IFrontendCollectionUnpopulated } from "@/lib/client/types/collectionTypes";
import { fetchCollections } from "@/lib/server/collection/data-fetching/fetchCollections";
import { buildUrl } from "@/utils/buildUrl";
import { redirect } from "next/navigation";

type CollectionFields = Pick<
  IFrontendCollectionUnpopulated,
  "title" | "slug" | "artworks"
>;

export default async function Artwork() {
  await dbConnect();
  const stem = "artwork";
  const identifierKey = "section";
  const identifierValue = "artwork";
  const fields = ["title", "slug", "artworks"];

  const response = await fetchCollections<CollectionFields>(
    identifierKey,
    identifierValue,
    fields
  );
  const { data: availableCollectionLinks } = response.success
    ? response
    : { data: [] };

  // Check if there is at least one collection and it has at least one artwork
  const defaultCollectionSublinkHref =
    availableCollectionLinks.length > 0 &&
    availableCollectionLinks[0].artworks.length > 0
      ? `${availableCollectionLinks[0].slug}/${availableCollectionLinks[0].artworks[0]}`
      : null;

  if (defaultCollectionSublinkHref) {
    const redirectUrl = buildUrl([
      stem,
      availableCollectionLinks[0].slug,
      availableCollectionLinks[0].artworks[0],
    ]);
    redirect(redirectUrl);
  }

  // If no collections or artworks are found, render an error message
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold">Artwork</h1>
      <p className="mt-4">No artworks are available at the moment.</p>
    </main>
  );
}
