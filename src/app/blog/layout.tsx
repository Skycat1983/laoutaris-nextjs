import Subnav from "@/components/ui/subnav/Subnav";
import dbConnect from "@/utils/mongodb";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();

  const stem = "blog";
  const subNavLinks: { title: string; slug: string }[] = [
    { title: "Latest", slug: "latest" },
    { title: "Oldest", slug: "oldest" },
    { title: "Featured", slug: "featured" },
    { title: "Popular", slug: "popular" },
  ];

  return (
    <section>
      <div className="flex flex-col flex-grow">
        <Subnav links={subNavLinks} stem={stem} />
        {children}
      </div>
    </section>
  );
}
