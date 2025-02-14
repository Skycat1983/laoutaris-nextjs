import dbConnect from "@/utils/mongodb";
import { buildUrl } from "@/utils/buildUrl";
import SubNavBar from "@/unused/SubNavBar";
import { SubNavBarLink } from "@/lib/resolvers/subnavResolvers";
import { Subnav } from "@/components/ui/subnav/Subnav";

export default async function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const stem = "project";

  const subNavLinks = [
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

  return (
    <section>
      <Subnav links={subNavLinks} />
      {children}
    </section>
  );
}
