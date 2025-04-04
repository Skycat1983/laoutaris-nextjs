import { SubnavLink } from "@/components/modules/navigation/subnav/Subnav";
import { buildUrl } from "../utils/urlUtils";

const BLOG_NAV_LINKS: SubnavLink[] = [
  {
    label: "Latest",
    slug: "latest",
    link_to: buildUrl(["blog"], { sortby: "latest" }),
    disabled: false,
  },
  {
    label: "Oldest",
    slug: "oldest",
    link_to: buildUrl(["blog"], { sortby: "oldest" }),
    disabled: false,
  },
  {
    label: "Featured",
    slug: "featured",
    link_to: buildUrl(["blog"], { sortby: "featured" }),
    disabled: false,
  },
  {
    label: "Popular",
    slug: "popular",
    link_to: buildUrl(["blog"], { sortby: "popular" }),
    disabled: false,
  },
];

export { BLOG_NAV_LINKS };
