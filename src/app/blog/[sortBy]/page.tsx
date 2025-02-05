import { Suspense } from "react";
import { BlogEntriesLoader } from "@/components/loaders/BlogEntriesLoader";
import BlogEntriesSkeleton from "@/components/skeletons/BlogEntriesSkeleton";

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
      <BlogEntriesLoader sortby={params.sortby} page={page} />
    </Suspense>
  );
}
