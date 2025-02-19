"use server";

import { buildUrl } from "@/lib/utils/buildUrl";
import ArticleView from "../../views/ArticleView";
import { serverApi } from "@/lib/api/server";

interface ArticleLoaderProps {
  slug: string;
}

export async function ArticleLoader({ slug }: ArticleLoaderProps) {
  const [articleResponse, navigationResponse] = await Promise.all([
    serverApi.article.fetchArticleArtwork(slug),
    serverApi.navigation.fetchArticleNavigationList("biography"),
  ]);

  if (!articleResponse.success) {
    throw new Error(articleResponse.error || "Failed to fetch article artwork");
  }

  if (!navigationResponse.success) {
    throw new Error(
      navigationResponse.error || "Failed to fetch article navigation"
    );
  }

  const article = articleResponse.data;
  const navigationList = navigationResponse.data;

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
