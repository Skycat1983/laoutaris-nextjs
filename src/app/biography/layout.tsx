import Subnav from "@/components/ui/subnav/Subnav";
import dbConnect from "@/utils/mongodb";
import { fetchBiographyLinks } from "@/lib/server/biography/data-fetching/fetchBiographyLinks";

export default async function BiographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const stem = "biography";

  const linksResult = await fetchBiographyLinks(stem);

  const { data } = linksResult.success ? linksResult : { data: [] };

  return (
    <section>
      {data && <Subnav links={data} stem={stem} />}
      {children}
    </section>
  );
}
