import { buildUrl } from "@/utils/buildUrl";
import { IFrontendCollectionUnpopulated } from "../client/types/collectionTypes";
import { IFrontendArticle } from "../client/types/articleTypes";

export interface SubNavBarLink {
  title: string;
  slug: string;
  url: string;
  disabled?: boolean;
}

export type SubNavArticleFields = Pick<IFrontendArticle, "title" | "slug">;

export const articleToSubNavLink = (
  item: SubNavArticleFields
): SubNavBarLink => ({
  title: item.title,
  slug: item.slug,
  url: buildUrl(["biography", item.slug]),
});

export type SubNavCollectionFields = Pick<
  IFrontendCollectionUnpopulated,
  "title" | "slug" | "artworks"
>;

export const collectionToSubNavLink = (
  item: SubNavCollectionFields
): SubNavBarLink => ({
  title: item.title,
  slug: item.slug,
  url: buildUrl(["collections", item.slug, item.artworks[0]]),
});
