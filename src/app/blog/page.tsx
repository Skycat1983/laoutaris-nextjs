import { BlogListLoader } from "@/components/loaders/viewLoaders/BlogListLoader";
import { BlogsSectionFeaturedSkeleton } from "@/components/sections/BlogsSectionFeatured";
import {
  parseBlogPageListQuery,
  type BlogListQueryInput,
} from "@/lib/data/schemas/blogListQuerySchema";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface BlogPageProps {
  searchParams: BlogListQueryInput;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { sortby, page } = parseBlogPageListQuery(searchParams);

  return (
    <main>
      <h1 className="sr-only">Blog</h1>
      <Suspense fallback={<BlogsSectionFeaturedSkeleton />}>
        <BlogListLoader sortby={sortby} page={page} />
      </Suspense>
    </main>
  );
}
