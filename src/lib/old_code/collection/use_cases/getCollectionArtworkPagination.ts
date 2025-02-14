import { fetchCollectionArtwork } from "../data-fetching/fetchCollectionArtwork";
import {
  PaginationArtworkLink,
  CollectionArtworkToPaginationBridge,
  collectionArtworkToPaginationLink,
} from "../resolvers/collectionArtworkToPaginationLink";
import { fetchAndResolveObj } from "@/lib/utils/fetchAndResolveObj";

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

  const fetchLinks = fetchAndResolveObj<
    CollectionArtworkToPaginationBridge,
    PaginationArtworkLink[]
  >(
    fetcher,
    collectionKey,
    collectionValue,
    collectionFields,
    collectionArtworkToPaginationLink,
    artworkFields
  );

  return await fetchLinks();
};
