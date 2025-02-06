import { Suspense } from "react";
import BlogEntriesSkeleton from "@/components/skeletons/BlogEntriesSkeleton";
import { BlogPageLoader } from "@/components/loaders/BlogPageLoader";

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
      <BlogPageLoader sortby={params.sortby} page={page} />
    </Suspense>
  );
}
