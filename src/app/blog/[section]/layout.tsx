import BlogSidebar from "@/components/ui/sidebar/BlogSidebar";
import { fetchBlogAvailability } from "@/lib/server/blog/data-fetching/fetchBlogAvailability";
import dbConnect from "@/utils/mongodb";

export default async function BlogSectionLayout({
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
      <div className="flex flex-col flex-grow p-4 md:p-10 lg:p-0">
        {/* <Subnav links={subNavLinks} stem={stem} /> */}
        <div className="grid grid-cols-12">
          {/* main content area */}
          <div className="col-start-1 col-span-8 xl:col-start-3 xl:col-span-6 bg-blue-100/50">
            {children}
          </div>
          {/* sidebar */}
          <div className="col-start-9 col-span-4 xl:col-start-9 xl:col-span-2 bg-slate-300/10 shadow mb-4">
            <BlogSidebar options={sortRangeOptions} />
          </div>
        </div>
      </div>
    </section>
  );
}
