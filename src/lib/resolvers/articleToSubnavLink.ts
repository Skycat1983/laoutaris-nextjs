import { buildUrl } from "@/utils/buildUrl";
import { FrontendArticleFull } from "../client/types/populatedTypes";

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
