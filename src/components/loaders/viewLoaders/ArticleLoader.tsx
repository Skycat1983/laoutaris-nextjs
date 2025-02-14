"use server";

import { fetchArticleArtwork } from "@/lib/api/public/articleApi";
import { fetchArticleNavigationList } from "@/lib/api/public/navigationApi";
import { buildUrl } from "@/lib/utils/buildUrl";
import ArticleView from "../../views/ArticleView";

interface ArticleLoaderProps {
  slug: string;
}

export async function ArticleLoader({ slug }: ArticleLoaderProps) {
  const [article, allArticles] = await Promise.all([
    fetchArticleArtwork(slug),
    fetchArticleNavigationList("biography"),
  ]);

  // Find current article index
  const currentIndex = allArticles.findIndex((a) => a.slug === slug);

  // Build navigation links
  const navigation = {
    prev:
      currentIndex > 0
        ? buildUrl(["biography", allArticles[currentIndex - 1].slug])
        : null,
    next:
      currentIndex < allArticles.length - 1
        ? buildUrl(["biography", allArticles[currentIndex + 1].slug])
        : null,
  };

  console.log("article in loader", article);

  return <ArticleView article={article} navigation={navigation} />;
}
