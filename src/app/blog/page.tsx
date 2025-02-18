import { BlogListLoader } from "@/components/loaders/viewLoaders/BlogListLoader";
import { Suspense } from "react";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { sortby?: string; page?: string };
}) {
  const validSortOptions = ["latest", "oldest", "popular", "featured"] as const;
  type SortOption = (typeof validSortOptions)[number];

  const sortby = (
    validSortOptions.includes(searchParams.sortby as SortOption)
      ? searchParams.sortby
      : "latest"
  ) as SortOption;

  const page = Math.max(1, parseInt(searchParams.page || "1", 10));

  return (
    <Suspense fallback={<></>}>
      <BlogListLoader sortby={sortby} page={page} />
    </Suspense>
  );
}
