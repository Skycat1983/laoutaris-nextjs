import Subnav from "@/components/ui/subnav/Subnav";
import dbConnect from "@/utils/mongodb";
import { getBiographySection } from "@/utils/server/getBiographySection";
import { getSectionContent } from "../../../unused/getSectionContent";

export default async function BiographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  // const sectionContent = await getSectionContent("biography");
  const sectionContent = await getBiographySection("biography");
  const stem = "biography";

  const subNavLinks = sectionContent?.map((article) => ({
    title: article.title,
    slug: article.slug,
  }))
    ? sectionContent
    : [];

  console.log("articles :>> ", sectionContent);
  return (
    <section>
      <Subnav items={subNavLinks} stem={stem} />
      {children}
    </section>
  );
}
