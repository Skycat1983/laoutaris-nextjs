import "server-only";

import { unstable_cache } from "next/cache";
import { getCollectionNavigationList } from "@/lib/data/services/getCollectionNavigationList";

export const COLLECTION_NAVIGATION_CACHE_REVALIDATE_SECONDS = 10 * 60;

export const getCachedCollectionNavigationList = unstable_cache(
  async () => getCollectionNavigationList(),
  ["public-collection-navigation"],
  { revalidate: COLLECTION_NAVIGATION_CACHE_REVALIDATE_SECONDS }
);
