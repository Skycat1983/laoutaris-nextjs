import { FrontendArticleUnpopulated } from "../client/types/articleTypes";
import { buildUrl } from "@/utils/buildUrl";

export type SelectedArticleField = Pick<FrontendArticleUnpopulated, "slug">;

export interface PrevNextLinks {
  prev: string | null;
  next: string | null;
}

//* needed to create closure to pass in currentSlug because fetchAndResolve doesn't allow for additional arguments
export const createPrevNextResolver = (currentSlug: string) => {
  return (articles: SelectedArticleField[]): PrevNextLinks => {
    return articlesToPrevNext(currentSlug, articles);
  };
};

//? findIndex allows us to search for an element in an array using a custom condition (callback function).
const articlesToPrevNext = (
  currentSlug: string,
  articles: SelectedArticleField[]
): PrevNextLinks => {
  const articleCount = articles.length;
  const currentIndex = articles.findIndex(
    (article) => article.slug === currentSlug
  );

  if (currentIndex === -1) {
    //? findIndex returns -1 if the element is not found
    throw new Error(`Current slug "${currentSlug}" not found in articles`);
  }
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < articleCount - 1;
  const prevUrl = hasPrev ? buildUrl([articles[currentIndex - 1].slug]) : null;
  const nextUrl = hasNext ? buildUrl([articles[currentIndex + 1].slug]) : null;
  return { prev: prevUrl, next: nextUrl };
};
