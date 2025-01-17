import { fetchAndResolve } from "@/utils/fetchAndResolve";
import {
  PrevNextLinks,
  SelectedArticleField,
  createPrevNextResolver,
} from "../resolvers/articlesToPrevNext";
import { fetchArticles } from "../server/article/data-fetching/fetchArticles";

export const getPrevNextArticleLinks = async ({
  currentSlug,
  section,
}: {
  currentSlug: string;
  section: string;
}) => {
  const identifierKey = "section";
  const identifierValue = section;
  const fields = ["slug"];
  const fetcher = fetchArticles;
  const resolver = createPrevNextResolver(currentSlug);

  return fetchAndResolve<SelectedArticleField[], PrevNextLinks>(
    fetcher,
    identifierKey,
    identifierValue,
    fields,
    resolver
  )();
};
