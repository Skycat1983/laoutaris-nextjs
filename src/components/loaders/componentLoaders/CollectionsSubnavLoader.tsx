"use server";

import { Subnav } from "@/components/modules/navigation/subnav/Subnav";
import { getCollectionNavigationList } from "@/lib/data/services/getCollectionNavigationList";
import { createSubnavLink } from "@/lib/helpers/createSubnavLink";

interface CollectionsSubnavLoaderProps {
  section: string;
}

export async function CollectionsSubnavLoader({
  section: _section,
}: CollectionsSubnavLoaderProps) {
  const result = await getCollectionNavigationList();

  if (!result) {
    throw new Error("No collections found");
  }

  const subnavLinks = result.data.map((collection) =>
    createSubnavLink(
      {
        label: collection.title,
        slug: collection.slug,
      },
      {
        stem: "collections",
        segments: [collection.firstArtworkId ?? ""],
      }
    )
  );

  return <Subnav links={subnavLinks} />;
}
