import Subnav from "@/components/ui/subnav/Subnav";
import dbConnect from "@/utils/mongodb";
import { getArtworkSection } from "@/utils/server/getArtworkSection";

export default async function ArtworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const sectionContent = await getArtworkSection("artwork");
  console.log("sectionContent in ARTWORK LAYOUT", sectionContent);
  const stem = "artwork";

  const subNavLinks = sectionContent?.map((article) => ({
    title: article.title,
    slug: article.slug,
  }))
    ? sectionContent
    : [];

  console.log("subNavLinks", subNavLinks);

  console.log("artwork :>> ", sectionContent);
  return (
    <section>
      <Subnav items={subNavLinks} stem={stem} />
      {children}
    </section>
  );
}
