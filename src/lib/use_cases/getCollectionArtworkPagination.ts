import { fetchCollectionArtwork } from "../server/collection/data-fetching/fetchCollectionArtwork";
import { fetchAndResolve } from "@/utils/fetchAndResolve";
import {
  PaginationArtworkLink,
  CollectionArtworkToPaginationBridge,
  collectionArtworkToPaginationLink,
} from "../resolvers/collectionArtworkToPaginationLink";

export const getCollectionArtworkPagination = async (
  collectionSlug: string
): Promise<PaginationArtworkLink[]> => {
  const fetcher = fetchCollectionArtwork;
  const collectionKey = "slug";
  const collectionValue = collectionSlug;
  const collectionFields = ["slug", "title"];
  const artworkFields = [
    "_id",
    "image.secure_url",
    "image.pixelHeight",
    "image.pixelWidth",
  ];
  const resolver = collectionArtworkToPaginationLink;

  const fetchLinks = fetchAndResolve<
    CollectionArtworkToPaginationBridge,
    PaginationArtworkLink[]
  >(
    fetcher,
    collectionKey,
    collectionValue,
    collectionFields,
    resolver,
    artworkFields
  );

  return (await fetchLinks()).flat();
};
