import Subnav from "@/components/ui/subnav/Subnav";
import dbConnect from "@/utils/mongodb";
import { fetchBiographyLinks } from "@/lib/server/biography/data-fetching/fetchBiographyLinks";
import { fetchBiographyFields } from "@/lib/server/biography/data-fetching/fetchBiographyFields";

interface SubnavLink {
  title: string;
  slug: string;
}

export default async function BiographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const stem = "biography";

  const linksResult = await fetchBiographyFields<SubnavLink>(stem, [
    "title slug",
  ]);

  const { data } = linksResult.success ? linksResult : { data: [] };

  return (
    <section>
      {data && <Subnav links={data} stem={stem} />}
      {children}
    </section>
  );
}
