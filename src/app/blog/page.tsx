import { BlogListLoader } from "@/components/loaders/viewLoaders/BlogListLoader";
import { BlogsSectionFeaturedSkeleton } from "@/components/sections/BlogsSectionFeatured";
import { Suspense } from "react";

const validSortOptions = ["latest", "oldest", "popular", "featured"] as const;
type SortOption = (typeof validSortOptions)[number];

interface BlogPageProps {
  searchParams: {
    sortby?: string;
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const sortby = validSortOptions.includes(searchParams.sortby as SortOption)
    ? (searchParams.sortby as SortOption)
    : undefined;

  const page = Math.max(1, parseInt(searchParams.page || "1", 10));

  return (
    <Suspense fallback={<BlogsSectionFeaturedSkeleton />}>
      <BlogListLoader sortby={sortby} page={page} />
    </Suspense>
  );
}
