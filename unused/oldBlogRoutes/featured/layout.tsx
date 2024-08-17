import BlogSidebar from "@/components/ui/sidebar/BlogSidebar";
import { fetchBlogAvailability } from "@/lib/server/blog/data-fetching/fetchBlogAvailability";
import dbConnect from "@/utils/mongodb";

export default async function FeaturedBlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const section = "featured";
  const result = await fetchBlogAvailability(section);

  const data = result.success ? result.data : {};

  const sortRangeOptions = [
    { label: "All posts", queryValue: "all" },
    ...Object.keys(data).map((year) => ({
      label: year,
      queryValue: year,
    })),
  ];

  return (
    <section>
      <div className="flex flex-col flex-grow">
        {/* <Subnav links={subNavLinks} stem={stem} /> */}
        <div className="grid grid-cols-12">
          {/* main content area */}
          <div className="col-start-3 col-span-6">{children}</div>
          {/* sidebar */}
          <div className="col-start-9 col-span-2 bg-slate/10 shadow mb-4">
            <BlogSidebar options={sortRangeOptions} />
          </div>
        </div>
      </div>
    </section>
  );
}
