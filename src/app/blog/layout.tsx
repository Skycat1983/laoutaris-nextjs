import BlogSidebar from "@/components/ui/sidebar/BlogSidebar";
import Subnav from "@/components/ui/subnav/Subnav";
import dbConnect from "@/utils/mongodb";
import { getBlogAvailability } from "@/utils/server/getBlogAvailability";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const blogEntryCountsByYearAndMonth = await getBlogAvailability();

  const sortRangeOptions = [
    { label: "All posts", queryValue: "all" },
    ...Object.keys(blogEntryCountsByYearAndMonth).map((year) => ({
      label: year,
      queryValue: year,
    })),
  ];
  //   console.log("sortRangeOptions", sortRangeOptions);

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
        <Subnav items={subNavLinks} stem={stem} />
        <div className="grid grid-cols-12">
          {/* main content area */}
          <div className="col-start-3 col-span-6">{children}</div>
          {/* sidebar */}
          <div className="col-start-9 col-span-2 bg-slate/10 shadow mb-4">
            <BlogSidebar
              options={sortRangeOptions}
              // updateSortRange={() => console.log("test")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

//   const sortByOptions: SortByOptions[] = [
//     { label: "Latest", queryValue: "recent" },
//     { label: "Oldest", queryValue: "oldest" },
//     { label: "Featured", queryValue: "featured" },
//     { label: "Popular", queryValue: "popular" },
//   ];
// const sectionContent = await getCollectionSection("artwork");
// console.log("sectionContent in ARTWORK LAYOUT", sectionContent);
// const stem = "artwork";

// const subNavLinks = sectionContent?.map((article) => ({
//   title: article.title,
//   slug: article.slug,
// }))
//   ? sectionContent
//   : [];

// console.log("subNavLinks", subNavLinks);
