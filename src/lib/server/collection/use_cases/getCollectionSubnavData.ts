import {
  SubNavBarLink,
  SubNavCollectionFields,
  collectionToSubNavLink,
} from "../../../resolvers/subnavResolvers";
import { fetchCollections } from "../data-fetching/fetchCollections";
import { fetchAndResolveArr } from "@/utils/fetchAndResolveArr";

// TODO: change the section from "artwork" to "collection"

export const getCollectionSubNavData = async (): Promise<SubNavBarLink[]> => {
  const fetcher = fetchCollections;

  const identifierKey = "section";
  const identifierValue = "artwork";

  const identifierFields = ["title", "slug", "artworks"];

  const fetchLinks = fetchAndResolveArr<
    SubNavCollectionFields,
    SubNavBarLink[]
  >(
    fetcher,
    identifierKey,
    identifierValue,
    identifierFields,
    (collections: SubNavCollectionFields[]) =>
      collections.map(collectionToSubNavLink)
  );

  return await fetchLinks();
};
