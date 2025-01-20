import { FrontendArticleUnpopulated } from "../../../types/articleTypes";
import { buildUrl } from "@/utils/buildUrl";

export type SelectedArticleField = Pick<FrontendArticleUnpopulated, "slug">;

export interface PrevNextLinks {
  prev: string | null;
  next: string | null;
}

//* needed to create closure to pass in currentSlug because fetchAndResolve doesn't allow for additional arguments
export const createPrevNextResolver = (segment: string, slug: string) => {
  return (articles: SelectedArticleField[]): PrevNextLinks => {
    return articlesToPrevNext(segment, slug, articles);
  };
};

//? findIndex allows us to search for an element in an array using a custom condition (callback function).
const articlesToPrevNext = (
  segment: string,
  slug: string,
  articles: SelectedArticleField[]
): PrevNextLinks => {
  console.log("currentSlug", slug);
  console.log("articles", articles);
  const articleCount = articles.length;
  const currentIndex = articles.findIndex((article) => article.slug === slug);

  if (currentIndex === -1) {
    //? findIndex returns -1 if the element is not found
    throw new Error(`Current slug "${slug}" not found in articles`);
  }
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < articleCount - 1;
  const prevUrl = hasPrev
    ? buildUrl([segment, articles[currentIndex - 1].slug])
    : null;
  const nextUrl = hasNext
    ? buildUrl([segment, articles[currentIndex + 1].slug])
    : null;
  return { prev: prevUrl, next: nextUrl };
};
