import SubNavBar from "@/components/ui/subnav/SubNavBar";
import Subnav from "@/components/ui/subnav/Subnav";
import dbConnect from "@/utils/mongodb";

export default async function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const stem = "project";

  const data = [
    { title: "About", slug: "about" },
    { title: "Aims", slug: "aims" },
    { title: "Timeline", slug: "timeline" },
    { title: "Film", slug: "film" },
    { title: "Contact", slug: "contact" },
  ];

  const links = data.map((link) => ({
    title: link.title,
    slug: link.slug,
    url: `/${stem}/${link.slug}`,
  }));

  return (
    <section className="p-0 m-0">
      {data && <SubNavBar links={links} />}
      {children}
    </section>
  );
}
