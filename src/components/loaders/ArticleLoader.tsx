import { fetchArticleArtwork } from "@/lib/api/articleApi";
import { fetchArticleNavigationList } from "@/lib/api/navigationApi";
import { buildUrl } from "@/utils/buildUrl";
import ArticleView from "../views/ArticleView";

interface ArticleLoaderProps {
  slug: string;
}

// TODO: currently hardcoded to biography. need to make it dynamic, pass in section/segment as a prop

export async function ArticleLoader({ slug }: ArticleLoaderProps) {
  // Fetch both article and navigation data in parallel
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

  return <ArticleView article={article} navigation={navigation} />;
}
