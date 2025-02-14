"use server";

import { Subnav } from "@/components/ui/navigation/subnav/Subnav";
import { fetchCollectionNavigationList } from "@/lib/api/navigationApi";
import { ValidSection } from "@/lib/types/navigationTypes";
import { buildUrl } from "@/utils/buildUrl";

interface CollectionsSubnavLoaderProps {
  section: ValidSection;
}

export async function CollectionsSubnavLoader({
  section,
}: CollectionsSubnavLoaderProps) {
  const collections = await fetchCollectionNavigationList(section);

  const links = collections.map((collection) => ({
    title: collection.title,
    slug: collection.slug,
    link_to: buildUrl(["collections", collection.slug, collection.artworkId]),
  }));

  return <Subnav links={links} />;
}
