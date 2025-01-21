import dbConnect from "@/utils/mongodb";
import { buildUrl } from "@/utils/buildUrl";
import SubNavBar from "@/components/ui/subnav/SubNavBar";
import { SubNavBarLink } from "@/lib/resolvers/subnavResolvers";

export default async function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const stem = "project";

  const subNavLinks: SubNavBarLink[] = [
    { title: "About", slug: "about", link_to: buildUrl([stem, "about"]) },
    {
      title: "Aims",
      slug: "aims",
      link_to: buildUrl([stem, "aims"]),
      disabled: true,
    },
    {
      title: "Timeline",
      slug: "timeline",
      link_to: buildUrl([stem, "timeline"]),
      disabled: true,
    },
    { title: "Film", slug: "film", link_to: buildUrl([stem, "film"]) },
    { title: "Contact", slug: "contact", link_to: buildUrl([stem, "contact"]) },
  ];

  const fetchLinks = async () => {
    return subNavLinks;
  };

  return (
    <section>
      <SubNavBar fetchLinks={fetchLinks} />
      {children}
    </section>
  );
}
