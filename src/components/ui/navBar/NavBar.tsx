"use server";

import { buildUrl } from "@/utils/buildUrl";
import MobileNavLayout from "./MobileNavLayout";
import TabletNavLayout from "./TabletNavLayout";
import DesktopNavLayout from "./DesktopNavLayout";
import {
  fetchArticleNavigationList,
  fetchCollectionNavigationList,
} from "@/lib/api/navigationApi";

export interface NavBarLink {
  label: string;
  path: string;
  disabled?: boolean;
}

const NavBar = async () => {
  const [articleNavigation, collectionNavigation] = await Promise.all([
    fetchArticleNavigationList("biography"),
    fetchCollectionNavigationList("collections"),
  ]);

  const navLinks: NavBarLink[] = [
    {
      label: "Biography",
      path: buildUrl(["biography", articleNavigation[0].slug]),
    },
    {
      label: "Collections",
      path: buildUrl([
        "collections",
        collectionNavigation[0].slug,
        collectionNavigation[0].artworkId,
      ]),
    },
    { label: "Blog", path: buildUrl(["blog", "latest"]) },
    { label: "Project", path: buildUrl(["project", "about"]) },
    { label: "Shop", path: buildUrl(["shop"]), disabled: true },
  ];

  return (
    <nav className="">
      <div className="block sm:hidden">
        <MobileNavLayout navLinks={navLinks} />
      </div>
      <div className="hidden sm:block lg:hidden">
        <TabletNavLayout navLinks={navLinks} />
      </div>
      <div className="hidden lg:block">
        <DesktopNavLayout navLinks={navLinks} />
      </div>
    </nav>
  );
};

export default NavBar;
