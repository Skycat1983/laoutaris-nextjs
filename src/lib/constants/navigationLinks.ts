import { buildUrl } from "@/lib/utils/buildUrl";

interface NavLink {
  title: string;
  slug: string;
  link_to: string;
  disabled?: boolean;
}

export const BLOG_NAV_LINKS: NavLink[] = [
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
