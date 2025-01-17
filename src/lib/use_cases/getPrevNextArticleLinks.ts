import { fetchAndResolve } from "@/utils/fetchAndResolve";
import {
  PrevNextLinks,
  SelectedArticleField,
  createPrevNextResolver,
} from "../resolvers/articlesToPrevNext";
import { fetchArticles } from "../server/article/data-fetching/fetchArticles";

export const getPrevNextArticleLinks = async ({
  segment,
  slug,
}: {
  segment: string;
  slug: string;
}) => {
  const identifierKey = "section";
  const identifierValue = segment;
  const fields = ["slug"];
  const fetcher = fetchArticles;
  const resolver = createPrevNextResolver(slug);

  const [links] = await fetchAndResolve<SelectedArticleField[], PrevNextLinks>(
    fetcher,
    identifierKey,
    identifierValue,
    fields,
    resolver
  )();

  return links;
};
