import ArticleViewSkeleton from "@/components/elements/skeletons/ArticleViewSkeleton";
import { ArticleLoader } from "@/components/loaders/viewLoaders/ArticleLoader";
import { Suspense } from "react";

export default async function About() {
  return (
    <Suspense fallback={<ArticleViewSkeleton />}>
      <ArticleLoader slug={"about"} section={"project"} />
    </Suspense>
  );
}
