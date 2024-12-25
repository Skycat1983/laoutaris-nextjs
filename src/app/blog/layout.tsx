import dbConnect from "@/utils/mongodb";
import { buildUrl } from "@/utils/buildUrl";
import SubNavBar from "@/components/ui/subnav/SubNavBar";
import { Content } from "next/font/google";
import ContentLayout from "@/components/layouts/ContentLayout";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();

  const stem = "blog";
  const subNavLinks: { title: string; slug: string; url: string }[] = [
    { title: "Latest", slug: "latest", url: buildUrl([stem, "latest"]) },
    { title: "Oldest", slug: "oldest", url: buildUrl([stem, "oldest"]) },
    { title: "Featured", slug: "featured", url: buildUrl([stem, "featured"]) },
    { title: "Popular", slug: "popular", url: buildUrl([stem, "popular"]) },
  ];

  return (
    <section className="flex flex-col flex-grow">
      {/* <div className="flex flex-col flex-grow"> */}
      <SubNavBar links={subNavLinks} />
      {children}
      {/* <ContentLayout>{children}</ContentLayout> */}
      {/* </div> */}
    </section>
  );
}
