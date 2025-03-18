"use server";

import { Subnav } from "@/components/modules/navigation/subnav/Subnav";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
import { ApiArticleNavListResult } from "@/lib/api/public/navigation/fetchers";
import {
  ApiErrorResponse,
  CollectionNavDataFrontend,
  ApiSuccessResponse,
} from "@/lib/data/types";
import { createSubnavLink } from "@/lib/utils/createSubnavLink";

interface CollectionsSubnavLoaderProps {
  section: string;
}

type SubnavLoaderResult = ApiArticleNavListResult | ApiErrorResponse;

export async function CollectionsSubnavLoader({
  section,
}: CollectionsSubnavLoaderProps) {
  const result: SubnavLoaderResult =
    await serverPublicApi.navigation.fetchCollectionNavigationList();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch collection navigation");
  }

  const { data } = result as ApiSuccessResponse<CollectionNavDataFrontend[]>;

  const subnavLinks = data.map((collection) =>
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
