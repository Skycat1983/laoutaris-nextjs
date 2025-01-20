import {
  PrevNextLinks,
  SelectedArticleField,
  createPrevNextResolver,
} from "../resolvers/articlesToPrevNext";
import { fetchArticles } from "../data-fetching/fetchArticles";
import { fetchAndResolveArr } from "@/utils/fetchAndResolveArr";

export const getArticlePrevNextLinks = async ({
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
  const resolver = createPrevNextResolver(segment, slug);

  const links = await fetchAndResolveArr<SelectedArticleField, PrevNextLinks>(
    fetcher,
    identifierKey,
    identifierValue,
    fields,
    resolver
  )();

  return links;
};
