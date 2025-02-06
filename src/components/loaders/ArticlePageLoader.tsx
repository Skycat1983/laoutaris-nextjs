import { fetchArticle, fetchArticleArtwork } from "@/lib/api/articleApi";
import ArticleView from "../views/ArticleView";
import {
  FrontendArticle,
  FrontendArticleWithArtwork,
} from "@/lib/types/articleTypes";

export async function ArticlePageLoader({ slug }: { slug: string }) {
  const article: FrontendArticleWithArtwork = await fetchArticleArtwork(slug);
  return <ArticleView article={article} />;
}
