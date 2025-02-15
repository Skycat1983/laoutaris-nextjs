"use server";

import { Subnav } from "@/components/modules/navigation/subnav/Subnav";
import { fetchCollectionNavigationList } from "@/lib/api/public/navigationApi";
import { ValidSection } from "@/lib/data/types/navigationTypes";
import { buildUrl } from "@/lib/utils/buildUrl";

interface CollectionsSubnavLoaderProps {
  section: ValidSection;
}

export async function CollectionsSubnavLoader({
  section,
}: CollectionsSubnavLoaderProps) {
  const collections = await fetchCollectionNavigationList(section);

  console.log("CollectionsSubnavLoader", collections);

  const links = collections.map((collection) => ({
    title: collection.title,
    slug: collection.slug,
    link_to: buildUrl(["collections", collection.slug, collection.artworkId]),
  }));

  return <Subnav links={links} />;
}
