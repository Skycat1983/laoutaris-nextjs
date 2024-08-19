import ServerPagination from "@/components/ui/serverPagination/ServerPagination";
import { fetchArtworkLinks } from "@/lib/server/artwork/data-fetching/fetchArtworkLinks";
import dbConnect from "@/utils/mongodb";

export default async function CollectionLayout({
  params,

  children,
}: {
  children: React.ReactNode;
  params: { collectionSlug: string };
}) {
  await dbConnect();
  console.log("collectionSlug", params.collectionSlug);
  const artworkLinksResult = await fetchArtworkLinks(params.collectionSlug);
  const artworkLinks = artworkLinksResult.success
    ? artworkLinksResult.data
    : null;

  // const { data } = linksResult.success ? linksResult : { data: [] };

  return (
    <section className="bg-red-100">
      {children}
      {artworkLinks && (
        <ServerPagination
          artworkLinks={artworkLinks}
          collectionSlug={params.collectionSlug}
        />
      )}
    </section>
  );
}
