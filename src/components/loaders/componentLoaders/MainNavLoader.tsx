import { MainNav } from "@/components/modules/navigation/mainNav/MainNav";
import {
  fetchArticleNavigationList,
  fetchCollectionNavigationList,
} from "@/lib/api/public/navigationApi";
import { buildUrl } from "@/lib/utils/buildUrl";
import { delay } from "@/lib/utils/debug";

export interface NavBarLink {
  label: string;
  path: string;
  disabled?: boolean;
}

export const MainNavLoader = async () => {
  // await delay(1000);
  const [articleNavigation, collectionNavigation] = await Promise.all([
    fetchArticleNavigationList("biography"),
    fetchCollectionNavigationList("collections"),
  ]);

  // console.log("articleNavigation", articleNavigation);
  // console.log("collectionNavigation", collectionNavigation);

  const navLinks = [
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
    { label: "Blog", path: buildUrl(["blog"], { sortby: "latest" }) }, // Add query param
    { label: "Project", path: buildUrl(["project", "about"]) },
    { label: "Shop", path: buildUrl(["shop"]), disabled: true },
  ];
  // console.log("navLinks", navLinks);
  // return <div>Loading...</div>;
  return <MainNav navLinks={navLinks} />;
};
