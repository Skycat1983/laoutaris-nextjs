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

  return (
    <section className="p-0 m-0">
      {data && <Subnav links={data} stem={stem} />}
      {children}
    </section>
  );
}
