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

{
  /* <div className="grid grid-cols-12"> */
}
{
  /* main content area */
}
{
  /* {children} */
}
{
  /* <div className="col-start-3 col-span-6">{children}</div> */
}
{
  /* sidebar */
}
{
  /* <div className="col-start-9 col-span-2 bg-slate/10 shadow mb-4">
            <BlogSidebar options={sortRangeOptions} />
          </div> */
}
{
  /* </div> */
}

// const blogAvailability = await fetchBlogAvailability();
// const blogEntryCountsByYearAndMonth = await getBlogAvailability();

// console.log("blogEntryCountsByYearAndMonth", blogEntryCountsByYearAndMonth);

// const sortRangeOptions = [
//   { label: "All posts", queryValue: "all" },
//   ...Object.keys(blogEntryCountsByYearAndMonth).map((year) => ({
//     label: year,
//     queryValue: year,
//   })),
// ];

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
