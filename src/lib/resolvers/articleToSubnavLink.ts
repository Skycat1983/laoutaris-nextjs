import { buildUrl } from "@/utils/buildUrl";
import { FrontendArticleMinimal } from "../client/types/articleTypes";

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
