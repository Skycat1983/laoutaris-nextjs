import { SubNavBarLink } from "../../../../unused/resolvers/subnavResolvers";
import { buildUrl } from "@/lib/utils/buildUrl";

export const BLOG_NAV_LINKS: SubNavBarLink[] = [
  {
    title: "Latest",
    slug: "latest",
    link_to: buildUrl(["blog"], { sortby: "latest" }),
  },
  {
    title: "Oldest",
    slug: "oldest",
    link_to: buildUrl(["blog"], { sortby: "oldest" }),
  },
  {
    title: "Featured",
    slug: "featured",
    link_to: buildUrl(["blog"], { sortby: "featured" }),
  },
  {
    title: "Popular",
    slug: "popular",
    link_to: buildUrl(["blog"], { sortby: "popular" }),
    disabled: true,
  },
];
