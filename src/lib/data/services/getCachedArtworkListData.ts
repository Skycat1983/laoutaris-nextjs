import "server-only";

import { unstable_cache } from "next/cache";
import { getArtworkList } from "@/lib/data/services/getArtworkList";

export const ARTWORK_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS = 10 * 60;

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
