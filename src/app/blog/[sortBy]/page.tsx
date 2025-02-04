import { delay } from "@/utils/debug";
import dbConnect from "@/utils/mongodb";
import BlogEntriesView from "@/components/views/BlogEntriesView";
import { fetchBlogEntriesSortedBy } from "@/lib/server/blog/data-fetching/fetchBlogEntriesSortedBy";
import { SortByType } from "@/app/api/blog/route";
import { Suspense } from "react";
import BlogEntriesSkeleton from "@/components/skeletons/BlogEntriesSkeleton";

type BlogEntriesLoaderProps = {
  sortby: SortByType;
  page: number;
};

async function BlogEntriesLoader({ sortby, page }: BlogEntriesLoaderProps) {
  await dbConnect();
  await delay(1000);
  const response = await fetchBlogEntriesSortedBy(sortby, page);
  console.log("response BlogEntriesLoader :>> ", response);
  if (!response.success) {
    return null;
  }
  const blogEntries = response.success ? response.data.results : [];
  const prev =
    response.data.page > 1
      ? `/blog/${sortby}?page=${response.data.page - 1}`
      : null;

  const next =
    response.data.page * response.data.limit < response.data.total
      ? `/blog/${sortby}?page=${response.data.page + 1}`
      : null;

  return (
    <>
      <BlogEntriesView
        blogEntries={blogEntries}
        sortby={sortby}
        next={next}
        prev={prev}
      />
    </>
  );
}

export default async function BlogSortBy({
  params,
  searchParams,
}: {
  params: { sortby: SortByType };
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  return (
    <>
      <Suspense fallback={<BlogEntriesSkeleton />}>
        <BlogEntriesLoader sortby={params.sortby} page={page} />
      </Suspense>
    </>
  );
}
