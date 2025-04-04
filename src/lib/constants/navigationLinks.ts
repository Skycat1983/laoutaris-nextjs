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

const NAV_LINK_BORDER_COLOURS = [
  "border-orange-400",
  "border-blue-400",
  "border-green-700",
  "border-red-600",
  "border-yellow-400",
  "border-purple-400",
  "border-pink-400",
  "border-gray-400",
  "border-teal-400",
  "border-lime-400",
  "border-fuchsia-400",
  "border-cyan-400",
  "border-emerald-400",
  "border-indigo-400",
  "border-violet-400",
];

export { BLOG_NAV_LINKS, NAV_LINK_BORDER_COLOURS };
