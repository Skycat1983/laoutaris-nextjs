import { BlogDetailLoader } from "@/components/loaders/viewLoaders/BlogDetailLoader";
import { Suspense } from "react";
import { BlogDetailSkeleton } from "@/components/views/BlogDetail";
import ArticleViewSkeleton from "@/components/elements/skeletons/ArticleViewSkeleton";
export default async function BlogSlug({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { comments?: string };
}) {
  const showComments = searchParams.comments === "true";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-12 py-4 container mx-auto">
      <Suspense fallback={<BlogDetailSkeleton />}>
        <BlogDetailLoader slug={params.slug} showComments={showComments} />
      </Suspense>
    </main>
  );
}
