import { BlogListLoader } from "@/components/loaders/viewLoaders/BlogListLoader";
import BlogEntriesSkeleton from "@/unused/sortby/BlogEntriesSkeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { sortby?: string; page?: string };
}) {
  if (!searchParams.sortby) {
    redirect("/blog?sortby=latest");
  }

  const sortby = (searchParams.sortby || "latest") as
    | "latest"
    | "oldest"
    | "popular"
    | "featured";
  const page = parseInt(searchParams.page || "1", 10);

  return (
    <Suspense fallback={<BlogEntriesSkeleton />}>
      <BlogListLoader sortby={sortby} page={page} />
    </Suspense>
  );
}
