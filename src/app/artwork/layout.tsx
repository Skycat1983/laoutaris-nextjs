import Subnav from "@/components/ui/subnav/Subnav";
import dbConnect from "@/utils/mongodb";
import { getSectionContent } from "@/utils/server/getSectionContent";

export default async function ArtworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const sectionContent = await getSectionContent("artwork");
  const stem = "artwork";

  const subNavLinks = sectionContent?.map((article) => ({
    title: article.title,
    slug: article.slug,
  }))
    ? sectionContent
    : [];

  console.log("artwork :>> ", sectionContent);
  return (
    <section>
      <Subnav items={subNavLinks} stem={stem} />
      {children}
    </section>
  );
}
