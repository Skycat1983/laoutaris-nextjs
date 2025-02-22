"use server";

import { buildUrl } from "@/lib/utils/buildUrl";
import { ArticleView } from "@/components/views/ArticleView";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
import {
  FrontendArticle,
  FrontendArticleWithArtwork,
} from "@/lib/data/types/articleTypes";
import { ArticleNavItem } from "@/lib/data/types/navigationTypes";

interface ArticleLoaderProps {
  slug: string;
}

type ArticleLoaderResponse = [
  ApiResponse<FrontendArticleWithArtwork>,
  ApiResponse<ArticleNavItem[]>
];

export async function ArticleLoader({ slug }: ArticleLoaderProps) {
  const [articleResponse, navigationResponse]: ArticleLoaderResponse =
    await Promise.all([
      serverPublicApi.article.fetchArticleArtwork(slug),
      serverPublicApi.navigation.fetchArticleNavigationList("biography"),
    ]);

  if (!articleResponse.success) {
    throw new Error(articleResponse.error || "Failed to fetch article artwork");
  }

  if (!navigationResponse.success) {
    throw new Error(
      navigationResponse.error || "Failed to fetch article navigation"
    );
  }

  const { data: article } =
    articleResponse as ApiSuccessResponse<FrontendArticleWithArtwork>;
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

  return <ArticleView article={article} navigation={navigation} />;
}
