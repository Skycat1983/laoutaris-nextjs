import dbConnect from "@/utils/mongodb";
import { buildUrl } from "@/utils/buildUrl";
import SubNavBar from "@/components/ui/subnav/SubNavBar";
import { SubNavBarLink } from "@/lib/resolvers/subnavResolvers";
import { delay } from "@/utils/debug";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();

  const stem = "blog";
  const subNavLinks: SubNavBarLink[] = [
    { title: "Latest", slug: "latest", link_to: buildUrl([stem, "latest"]) },
    { title: "Oldest", slug: "oldest", link_to: buildUrl([stem, "oldest"]) },
    {
      title: "Featured",
      slug: "featured",
      link_to: buildUrl([stem, "featured"]),
    },
    {
      title: "Popular",
      slug: "popular",
      link_to: buildUrl([stem, "popular"]),
      disabled: true,
    },
  ];

  const fetchLinks = async () => {
    // await delay(2000);
    return subNavLinks;
  };

  return (
    <section className="flex flex-col flex-grow">
      <SubNavBar fetchLinks={fetchLinks} />
      {children}
    </section>
  );
}
