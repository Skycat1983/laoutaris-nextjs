import { fetchArticle, fetchArticleArtwork } from "@/lib/api/public/articleApi";
import ArticleView from "../src/components/views/ArticleView";
import {
  FrontendArticle,
  FrontendArticleWithArtwork,
} from "@/lib/data/types/articleTypes";

export async function ArticlePageLoader({ slug }: { slug: string }) {
  const article: FrontendArticleWithArtwork = await fetchArticleArtwork(slug);
  return <ArticleView article={article} />;
}
