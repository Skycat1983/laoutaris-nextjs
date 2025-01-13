import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import { buildUrl } from "./buildUrl";
import { IFrontendCollectionUnpopulated } from "@/lib/client/types/collectionTypes";
import { SubNavBarLink } from "@/components/ui/subnav/SubNavBar";

type SubNavArticleFields = Pick<IFrontendArticle, "title" | "slug">;

type SubNavCollectionFields = Pick<
  IFrontendCollectionUnpopulated,
  "title" | "slug" | "artworks"
>;

export const articleToSubNavLink = (
  item: SubNavArticleFields
): SubNavBarLink => ({
  title: item.title,
  slug: item.slug,
  url: buildUrl(["biography", item.slug]),
});

export const collectionToSubNavLink = (
  item: SubNavCollectionFields
): SubNavBarLink => ({
  title: item.title,
  slug: item.slug,
  url: buildUrl(["collections", item.slug, item.artworks[0]]),
});
