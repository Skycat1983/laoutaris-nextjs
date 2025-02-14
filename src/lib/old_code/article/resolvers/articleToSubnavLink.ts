import { FrontendArticleUnpopulated } from "@/lib/data/types/articleTypes";
import { buildUrl } from "@/lib/utils/buildUrl";

export interface SubNavBarLink {
  title: string;
  slug: string;
  link_to: string;
  disabled?: boolean;
}

export type SubNavArticleFields = Pick<
  FrontendArticleUnpopulated,
  "title" | "slug"
>;

export const articleToSubNavLink = (
  item: SubNavArticleFields
): SubNavBarLink => ({
  title: item.title,
  slug: item.slug,
  link_to: buildUrl(["biography", item.slug]),
});
