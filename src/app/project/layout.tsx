import dbConnect from "@/utils/mongodb";
import { buildUrl } from "@/utils/buildUrl";
import SubNavBar, { SubNavBarLink } from "@/components/ui/subnav/SubNavBar";

export default async function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const stem = "project";

  const subNavLinks: SubNavBarLink[] = [
    { title: "About", slug: "about", url: buildUrl([stem, "about"]) },
    {
      title: "Aims",
      slug: "aims",
      url: buildUrl([stem, "aims"]),
      disabled: true,
    },
    {
      title: "Timeline",
      slug: "timeline",
      url: buildUrl([stem, "timeline"]),
      disabled: true,
    },
    { title: "Film", slug: "film", url: buildUrl([stem, "film"]) },
    { title: "Contact", slug: "contact", url: buildUrl([stem, "contact"]) },
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
