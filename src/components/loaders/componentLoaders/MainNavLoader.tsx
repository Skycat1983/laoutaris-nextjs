import { MainNav } from "@/components/modules/navigation/mainNav/MainNav";
import { buildUrl } from "@/lib/utils/urlUtils";
import type { NavBarLink } from "@/components/modules/navigation/mainNav/types";

const BIOGRAPHY_PATH = buildUrl(["biography"]);
const COLLECTIONS_PATH = buildUrl(["collections"]);

const MAIN_NAV_LINKS: NavBarLink[] = [
  {
    label: "Artwork",
    path: buildUrl(["artwork"]),
  },
  {
    label: "Biography",
    path: BIOGRAPHY_PATH,
  },
  {
    label: "Collections",
    path: COLLECTIONS_PATH,
  },
  { label: "Blog", path: buildUrl(["blog"]) },
  { label: "Project", path: buildUrl(["project", "about"]) },
  { label: "Shop", path: buildUrl(["shop"]) },
];

export const getMainNavLinks = (): NavBarLink[] =>
  MAIN_NAV_LINKS.map((link) => ({ ...link }));

export const MainNavLoader = () => {
  const navLinks = getMainNavLinks();

  return <MainNav navLinks={navLinks} />;
};
