import {
  SubNavArticleFields,
  SubNavBarLink,
  articleToSubNavLink,
} from "../../../resolvers/subnavResolvers";
import { fetchArticles } from "../data-fetching/fetchArticles";
import { fetchAndResolveArr } from "@/utils/fetchAndResolveArr";

export const getBiographySubNavData = async (): Promise<SubNavBarLink[]> => {
  const fetcher = fetchArticles;

  const identifierKey = "section";
  const identifierValue = "biography";
  const identifierFields = ["title", "slug"];

  const fetchLinks = fetchAndResolveArr<SubNavArticleFields, SubNavBarLink[]>(
    fetcher,
    identifierKey,
    identifierValue,
    identifierFields,
    (articles: SubNavArticleFields[]) => articles.map(articleToSubNavLink)
  );

  return await fetchLinks();
};
