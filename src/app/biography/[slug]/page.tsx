import { Suspense } from "react";
import type { Metadata } from "next";
import ArticleViewSkeleton from "@/components/elements/skeletons/ArticleViewSkeleton";
import { ArticleLoader } from "@/components/loaders/viewLoaders/ArticleLoader";
import { BiographyArticleStructuredData } from "@/components/metadata/PublicDetailJsonLd";
import { getCachedBiographyArticleBySlug } from "@/lib/data/services/getCachedBiographyArticleData";
import {
  buildArticleDetailMetadata,
  buildMissingPublicDetailMetadata,
  buildUnavailablePublicDetailMetadata,
} from "@/lib/metadata/publicDetailMetadata";

export const dynamic = "force-dynamic";

type BiographySlugPageProps = {
  params: { slug: string };
};

export async function generateMetadata({
  params,
}: BiographySlugPageProps): Promise<Metadata> {
  try {
    const article = await getCachedBiographyArticleBySlug(params.slug);

    if (!article) {
      return buildMissingPublicDetailMetadata("Article");
    }

    return buildArticleDetailMetadata(article);
  } catch {
    return buildUnavailablePublicDetailMetadata("Article");
  }
}

export default async function BiographySlugPage({
  params,
}: BiographySlugPageProps) {
  const { slug } = params;

  return (
    <>
      <Suspense fallback={null}>
        <BiographyArticleStructuredData slug={slug} />
      </Suspense>
      <Suspense fallback={<ArticleViewSkeleton />}>
        <ArticleLoader slug={slug} section="biography" />
      </Suspense>
    </>
  );
}
