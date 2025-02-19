"use server";

import { Subnav } from "@/components/modules/navigation/subnav/Subnav";
import { fetchCollectionNavigationList } from "@/lib/api/public/navigationApi";
import { ValidSection } from "@/lib/data/types/navigationTypes";
import { buildUrl } from "@/lib/utils/buildUrl";
import { serverApi } from "@/lib/api/server";

interface CollectionsSubnavLoaderProps {
  section: ValidSection;
}

export async function CollectionsSubnavLoader({
  section,
}: CollectionsSubnavLoaderProps) {
  const result = await serverApi.navigation.fetchCollectionNavigationList();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch collection navigation");
  }

  const { data: collections } = result;
  console.log("CollectionsSubnavLoader", collections);

  const links = result.data.map((collection) => ({
    title: collection.title,
    slug: collection.slug,
    link_to: buildUrl(["collections", collection.slug, collection.artworkId]),
  }));

  return <Subnav links={links} />;
}
