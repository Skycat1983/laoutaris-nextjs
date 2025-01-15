import { fetchAndResolve } from "@/utils/fetchAndResolve";
import {
  SubNavArticleFields,
  SubNavBarLink,
  articleToSubNavLink,
} from "../resolvers/subnavResolvers";
import { fetchArticles } from "../server/article/data-fetching/fetchArticles";

export const getBiographySubNavData = async (): Promise<SubNavBarLink[]> => {
  const fetcher = fetchArticles;

  const identifierKey = "section";
  const identifierValue = "biography";
  const identifierFields = ["title", "slug"];

  const fetchLinks = fetchAndResolve<SubNavArticleFields, SubNavBarLink>(
    fetcher,
    identifierKey,
    identifierValue,
    identifierFields,
    articleToSubNavLink
  );

  return await fetchLinks();
};
