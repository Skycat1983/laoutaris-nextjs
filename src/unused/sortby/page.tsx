import { Suspense } from "react";
import BlogEntriesSkeleton from "@/unused/sortby/BlogEntriesSkeleton";
import { BlogListLoader } from "@/components/loaders/viewLoaders/BlogListLoader";

export default async function BlogSortBy({
  params,
  searchParams,
}: {
  params: { sortby: "latest" | "oldest" | "popular" | "featured" };
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);

  return (
    <Suspense fallback={<BlogEntriesSkeleton />}>
      <BlogListLoader sortby={params.sortby} page={page} />
    </Suspense>
  );
}
