import { Suspense } from "react";
import ArticleViewSkeleton from "@/components/elements/skeletons/ArticleViewSkeleton";
import { ArticleLoader } from "@/components/loaders/viewLoaders/ArticleLoader";

export default async function BiographySlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  return (
    <>
      <Suspense fallback={<ArticleViewSkeleton />}>
        <ArticleLoader slug={slug} />
      </Suspense>
    </>
  );
}
