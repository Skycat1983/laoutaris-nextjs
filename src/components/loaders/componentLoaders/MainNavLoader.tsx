import { MainNav } from "@/components/modules/navigation/mainNav/MainNav";
import type { NavBarLink } from "@/components/modules/navigation/mainNav/types";
import { publicAppRoutes } from "@/lib/routes/publicAppRoutes";

const MAIN_NAV_LINKS: NavBarLink[] = [
  {
    label: "Artwork",
    path: publicAppRoutes.artwork,
  },
  {
    label: "Biography",
    path: publicAppRoutes.biography,
  },
  {
    label: "Collections",
    path: publicAppRoutes.collections,
  },
  { label: "Blog", path: publicAppRoutes.blog },
  { label: "Project", path: `${publicAppRoutes.project}/about` },
  { label: "Shop", path: publicAppRoutes.shop },
];

export const getMainNavLinks = (): NavBarLink[] =>
  MAIN_NAV_LINKS.map((link) => ({ ...link }));

export const MainNavLoader = () => {
  const navLinks = getMainNavLinks();

  return <MainNav navLinks={navLinks} />;
};
