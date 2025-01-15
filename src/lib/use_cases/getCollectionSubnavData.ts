import { fetchAndResolve } from "@/utils/fetchAndResolve";
import {
  SubNavBarLink,
  SubNavCollectionFields,
  collectionToSubNavLink,
} from "../resolvers/subnavResolvers";
import { fetchCollections } from "../server/collection/data-fetching/fetchCollections";

export const getCollectionSubNavData = async (): Promise<SubNavBarLink[]> => {
  const fetcher = fetchCollections;

  const identifierKey = "section";
  const identifierValue = "artwork";

  const identifierFields = ["title", "slug", "artworks"];

  const fetchLinks = fetchAndResolve<SubNavCollectionFields, SubNavBarLink>(
    fetcher,
    identifierKey,
    identifierValue,
    identifierFields,
    collectionToSubNavLink
  );

  return await fetchLinks();
};
