import "server-only";

import { unstable_cache } from "next/cache";
import {
  getArtworkList,
  type ArtworkListServiceResult,
} from "@/lib/data/services/getArtworkList";

export const ARTWORK_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS = 10 * 60;
type BoundedDefaultArtworkListPage = 2 | 3 | 4 | 5;

const createCachedDefaultArtworkListPage = (
  page: BoundedDefaultArtworkListPage,
  cacheKey: string
) =>
  unstable_cache(
    async () =>
      getArtworkList({
        sortBy: "mostRecent",
        page,
        limit: 10,
        filterMode: "ALL",
        decade: [],
        artstyle: [],
        medium: [],
        surface: [],
      }),
    [cacheKey],
    { revalidate: ARTWORK_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS }
  );

export const getCachedDefaultArtworkList = unstable_cache(
  async () =>
    getArtworkList({
      sortBy: "mostRecent",
      page: 1,
      limit: 10,
      filterMode: "ALL",
      decade: [],
      artstyle: [],
      medium: [],
      surface: [],
    }),
  ["public-artwork-default-list-page-1-limit-10-most-recent"],
  { revalidate: ARTWORK_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS }
);

export const getCachedDefaultArtworkListPage2 =
  createCachedDefaultArtworkListPage(
    2,
    "public-artwork-default-list-page-2-limit-10-most-recent"
  );

export const getCachedDefaultArtworkListPage3 =
  createCachedDefaultArtworkListPage(
    3,
    "public-artwork-default-list-page-3-limit-10-most-recent"
  );

export const getCachedDefaultArtworkListPage4 =
  createCachedDefaultArtworkListPage(
    4,
    "public-artwork-default-list-page-4-limit-10-most-recent"
  );

export const getCachedDefaultArtworkListPage5 =
  createCachedDefaultArtworkListPage(
    5,
    "public-artwork-default-list-page-5-limit-10-most-recent"
  );

export const getCachedDefaultArtworkListPage = (
  page: number
): Promise<ArtworkListServiceResult> | undefined => {
  switch (page) {
    case 1:
      return getCachedDefaultArtworkList();
    case 2:
      return getCachedDefaultArtworkListPage2();
    case 3:
      return getCachedDefaultArtworkListPage3();
    case 4:
      return getCachedDefaultArtworkListPage4();
    case 5:
      return getCachedDefaultArtworkListPage5();
    default:
      return undefined;
  }
};
