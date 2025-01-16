import { buildUrl } from "@/utils/buildUrl";
import {
  FrontendArticleFull,
  FrontendCollectionFull,
} from "../client/types/populatedTypes";

export interface SubNavBarLink {
  title: string;
  slug: string;
  link_to: string;
  disabled?: boolean;
}

export type SubNavArticleFields = Pick<FrontendArticleFull, "title" | "slug">;

export const articleToSubNavLink = (
  item: SubNavArticleFields
): SubNavBarLink => ({
  title: item.title,
  slug: item.slug,
  link_to: buildUrl(["biography", item.slug]),
});

export type SubNavCollectionFields = Pick<
  FrontendCollectionFull,
  "title" | "slug" | "artworks"
>;

export const collectionToSubNavLink = (
  item: SubNavCollectionFields
): SubNavBarLink => ({
  title: item.title,
  slug: item.slug,
  link_to: buildUrl(["collections", item.slug, item.artworks[0]]),
});
