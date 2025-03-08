"use server";

import { buildUrl } from "@/lib/utils/buildUrl";
import { ArticleView } from "@/components/views/ArticleView";
import { FrontendArticleWithArtwork } from "@/lib/data/types/articleTypes";
import { ArticleNavItem, ValidSection } from "@/lib/data/types/navigationTypes";
import { serverApi } from "@/lib/api/serverApi";
import { ApiResponse, ApiSuccessResponse } from "@/lib/data/types";
import { ApiArticlePopulatedResult } from "@/lib/api/public/article/fetchers";

interface ArticleLoaderProps {
  slug: string;
  section: ValidSection;
}

type FetcherResponses = [
  ApiResponse<ApiSingleArticlePopulatedResult>,
  ApiResponse<ArticleNavItem[]>
];

export async function ArticleLoader({ slug, section }: ArticleLoaderProps) {
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
    articleResponse as ApiSuccessResponse<ApiSingleArticlePopulatedResult>;

  const { data: navigationList } = navigationResponse as ApiSuccessResponse<
    ArticleNavItem[]
  >;

  // Find current article index
  const currentIndex = navigationList.findIndex((a) => a.slug === slug);

  // Build navigation links
  const navigation = {
    prev:
      currentIndex > 0
        ? buildUrl(["biography", navigationList[currentIndex - 1].slug])
        : null,
    next:
      currentIndex < navigationList.length - 1
        ? buildUrl(["biography", navigationList[currentIndex + 1].slug])
        : null,
  };

  console.log("article in loader", article);

  return <ArticleView article={article.data} navigation={navigation} />;
}
