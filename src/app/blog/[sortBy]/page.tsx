import { BlogSection } from "@/lib/server/blog/blogTypes";
import { delay } from "@/utils/debug";
import dbConnect from "@/utils/mongodb";
import BlogSectionView from "@/components/views/BlogEntriesView";
import BlogSidebar from "@/components/ui/sidebar/BlogSidebar";
import BlogEntriesView from "@/components/views/BlogEntriesView";
import { fetchBlogEntriesSortedBy } from "@/lib/server/blog/data-fetching/fetchBlogEntriesSortedBy";

export default async function BlogSortBy({
  params,
}: {
  params: { sortBy: BlogSection };
}) {
  await dbConnect();
  await delay(2000);
  const result = await fetchBlogEntriesSortedBy(params.sortBy);
  const blogEntries = result.success ? result.data : null;

  console.log("blogEntries :>> ", blogEntries);

  return <>{blogEntries && <BlogEntriesView blogEntries={blogEntries} />}</>;
}

{
  /* <main className="flex min-h-screen flex-col items-center justify-between md:px-12 py-4 container">
      {blogEntries && <BlogEntriesView blogEntries={blogEntries} />}
      <div className="hidden md:block col-start-9 col-span-4 lg:col-start-9 lg:col-span-3 2xl:col-start-9 2xl:col-span-2 bg-slate-300/10 shadow mb-4">
        <BlogSidebar options={sortRangeOptions} />
      </div> 
      </main> */
}
