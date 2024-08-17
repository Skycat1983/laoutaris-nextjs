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

  const linksResult = await fetchCollectionLinks(stem);

  const { data } = linksResult.success ? linksResult : { data: [] };

  return (
    <section>
      {data && <Subnav links={data} stem={stem} />}
      {children}
    </section>
  );
}
