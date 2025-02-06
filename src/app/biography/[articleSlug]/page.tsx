import dbConnect from "@/utils/mongodb";
import { Suspense } from "react";
import ArticleViewSkeleton from "@/components/skeletons/ArticleViewSkeleton";
import { ArticleLoader } from "@/components/loaders/ArticleLoader";

export default async function Article({
  params,
}: {
  params: { articleSlug: string };
}) {
  await dbConnect();
  const slug = params.articleSlug;

  return (
    <>
      <Suspense fallback={<ArticleViewSkeleton />}>
        <ArticleLoader slug={slug} />
      </Suspense>
    </>
  );
}
