import dbConnect from "@/utils/mongodb";
import { IFrontendCollectionUnpopulated } from "@/lib/client/types/collectionTypes";
import { fetchCollections } from "@/lib/server/collection/data-fetching/fetchCollections";
import { buildUrl } from "@/utils/buildUrl";
import SubNavBar from "@/components/ui/subnav/SubNavBar";

type SubnavCollectionFields = Pick<
  IFrontendCollectionUnpopulated,
  "title" | "slug" | "artworks"
>;

export default async function ArtworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const stem = "artwork";
  const identifierKey = "section";
  const identifierValue = "artwork";
  const fields = ["title", "slug", "artworks"];
  const response = await fetchCollections<SubnavCollectionFields>(
    identifierKey,
    identifierValue,
    fields
  );
  const { data } = response.success ? response : { data: [] };

  const collectionLinks = data.map((link) => ({
    title: link.title,
    slug: link.slug,
    url: buildUrl([stem, link.slug, link.artworks[0]]),
  }));

  return (
    <section className="p-0 m-0">
      {data && <SubNavBar links={collectionLinks} />}
      {children}
    </section>
  );
}
