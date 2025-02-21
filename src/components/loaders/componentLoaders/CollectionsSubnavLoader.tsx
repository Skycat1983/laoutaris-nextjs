"use server";

import { Subnav } from "@/components/modules/navigation/subnav/Subnav";
import { fetchCollectionNavigationList } from "../../../../phase_out/navigationApi";
import {
  CollectionNavItem,
  ValidSection,
} from "@/lib/data/types/navigationTypes";
import { buildUrl } from "@/lib/utils/buildUrl";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";

interface CollectionsSubnavLoaderProps {
  section: ValidSection;
}

export async function CollectionsSubnavLoader({
  section,
}: CollectionsSubnavLoaderProps) {
  const result: ApiResponse<CollectionNavItem[]> =
    await serverPublicApi.navigation.fetchCollectionNavigationList();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch collection navigation");
  }

  const { data } = result as ApiSuccessResponse<CollectionNavItem[]>;

  const links = data.map((collection) => ({
    title: collection.title,
    slug: collection.slug,
    link_to: buildUrl(["collections", collection.slug, collection.artworkId]),
  }));

  return <Subnav links={links} />;
}
