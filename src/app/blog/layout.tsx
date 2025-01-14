import dbConnect from "@/utils/mongodb";
import { buildUrl } from "@/utils/buildUrl";
import SubNavBar, { SubNavBarLink } from "@/components/ui/subnav/SubNavBar";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();

  const stem = "blog";
  const subNavLinks: SubNavBarLink[] = [
    { title: "Latest", slug: "latest", url: buildUrl([stem, "latest"]) },
    { title: "Oldest", slug: "oldest", url: buildUrl([stem, "oldest"]) },
    { title: "Featured", slug: "featured", url: buildUrl([stem, "featured"]) },
    {
      title: "Popular",
      slug: "popular",
      url: buildUrl([stem, "popular"]),
      disabled: true,
    },
  ];

  const fetchLinks = async () => {
    return subNavLinks;
  };

  return (
    <section className="flex flex-col flex-grow">
      <SubNavBar fetchLinks={fetchLinks} />
      {children}
    </section>
  );
}
