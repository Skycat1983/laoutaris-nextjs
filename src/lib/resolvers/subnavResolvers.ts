import { buildUrl } from "@/utils/buildUrl";
import { FrontendArticleMinimal } from "../client/types/articleTypes";
import { FrontendCollectionMinimal } from "../client/types/collectionTypes";

export interface SubNavBarLink {
  title: string;
  slug: string;
  link_to: string;
  disabled?: boolean;
}

export type SubNavArticleFields = Pick<
  FrontendArticleMinimal,
  "title" | "slug"
>;

export const articleToSubNavLink = (
  item: SubNavArticleFields
): SubNavBarLink => ({
  title: item.title,
  slug: item.slug,
  link_to: buildUrl(["biography", item.slug]),
});

export type SubNavCollectionFields = Pick<
  FrontendCollectionMinimal,
  "title" | "slug" | "artworks"
>;

export const collectionToSubNavLink = (
  item: SubNavCollectionFields
): SubNavBarLink => ({
  title: item.title,
  slug: item.slug,
  link_to: buildUrl(["collections", item.slug, item.artworks[0]]),
});
