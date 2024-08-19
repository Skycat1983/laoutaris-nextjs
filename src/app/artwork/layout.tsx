import Subnav from "@/components/ui/subnav/Subnav";
import dbConnect from "@/utils/mongodb";
import { fetchCollectionLinks } from "@/lib/server/collection/data-fetching/fetchCollectionLinks";

export default async function ArtworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const stem = "artwork";

  const collectionLinksResult = await fetchCollectionLinks(stem);

  const { data } = collectionLinksResult.success
    ? collectionLinksResult
    : { data: [] };

  console.log("data in Artwork Layout", data);

  return (
    <section>
      {data && <Subnav links={data} stem={stem} />}
      {children}
    </section>
  );
}
