import Subnav from "@/components/ui/subnav/Subnav";
import dbConnect from "@/utils/mongodb";
import { getSectionContent } from "@/utils/server/getSectionContent";
import { redirect } from "next/navigation";

export default async function BiographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const sectionContent = await getSectionContent("biography");
  const stem = "biography";

  const subNavLinks = sectionContent?.map((article) => ({
    title: article.title,
    slug: article.slug,
  }))
    ? sectionContent
    : [];

  // if (subNavLinks.length) {
  //   redirect(subNavLinks[0].slug);
  // }
  // console.log("articles :>> ", sectionContent);
  return (
    <section>
      <Subnav items={subNavLinks} stem={stem} />
      {children}
    </section>
  );
}
