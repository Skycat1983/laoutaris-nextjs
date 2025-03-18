"use server";

import { buildUrl } from "@/lib/utils/buildUrl";
import { ArticleView } from "@/components/views/ArticleView";
import { serverApi } from "@/lib/api/serverApi";
import {
  ArticleFrontendPopulated,
  ArticleNavDataFrontend,
  ApiResponse,
  ApiSuccessResponse,
} from "@/lib/data/types";
import { ArticleSection } from "@/lib/constants";

interface ArticleLoaderProps {
  slug: string;
  section: ArticleSection;
  form?: React.ReactNode;
}

type FetcherResponses = [
  ApiResponse<ArticleFrontendPopulated>,
  ApiResponse<ArticleNavDataFrontend[]>
];

export async function ArticleLoader({
  slug,
  section,
  form,
}: ArticleLoaderProps) {
  const [articleResponse, navigationResponse] = (await Promise.all([
    serverApi.public.article.singlePopulated(slug),
    serverApi.public.navigation.fetchArticleNavigationList(section),
  ])) as FetcherResponses;

  if (!articleResponse.success) {
    throw new Error(articleResponse.error || "Failed to fetch article artwork");
  }

  if (!navigationResponse.success) {
    throw new Error(
      navigationResponse.error || "Failed to fetch article navigation"
    );
  }

  const { data: article } =
    articleResponse as ApiSuccessResponse<ArticleFrontendPopulated>;

  const { data: navigationList } = navigationResponse as ApiSuccessResponse<
    ArticleNavDataFrontend[]
  >;

  // Find current article index
  const currentIndex = navigationList.findIndex((a) => a.slug === slug);

  // Build navigation links
  const navigation = {
    prev:
      currentIndex > 0
        ? buildUrl([section, navigationList[currentIndex - 1].slug])
        : null,
    next:
      currentIndex < navigationList.length - 1
        ? buildUrl([section, navigationList[currentIndex + 1].slug])
        : null,
  };

  if (form) {
    return (
      <ArticleView article={article} navigation={navigation} form={form} />
    );
  }

  return <ArticleView article={article} navigation={navigation} />;
}
