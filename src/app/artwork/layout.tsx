import Subnav from "@/components/ui/subnav/Subnav";
import dbConnect from "@/utils/mongodb";
import { getCollectionSection } from "@/utils/server/getCollectionSection";

export default async function ArtworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const sectionContent = await getCollectionSection("artwork");
  // console.log("sectionContent in ARTWORK LAYOUT", sectionContent);
  const stem = "artwork";

  const subNavLinks = sectionContent?.map((article) => ({
    title: article.title,
    slug: article.slug,
  }))
    ? sectionContent
    : [];

  // console.log("subNavLinks", subNavLinks);

  return (
    <section>
      <Subnav items={subNavLinks} stem={stem} />
      {children}
    </section>
  );
}
