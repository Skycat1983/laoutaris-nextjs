import { MainNav } from "@/components/modules/navigation/mainNav/MainNav";
import { buildUrl } from "@/lib/utils/buildUrl";
import { serverApi } from "@/lib/api/server";

export interface NavBarLink {
  label: string;
  path: string;
  disabled?: boolean;
}

export const MainNavLoader = async () => {
  const [articleNavigation, collectionNavigation] = await Promise.all([
    serverApi.navigation.fetchArticleNavigationList("biography"),
    serverApi.navigation.fetchCollectionNavigationList(),
  ]);

  if (!articleNavigation.success) {
    throw new Error(
      articleNavigation.error || "Failed to fetch article navigation"
    );
  }

  if (!collectionNavigation.success) {
    throw new Error(
      collectionNavigation.error || "Failed to fetch collection navigation"
    );
  }

  const { data: articleNavigationList } = articleNavigation;
  const { data: collectionNavigationList } = collectionNavigation;

  const navLinks: NavBarLink[] = [
    {
      label: "Biography",
      path: buildUrl(["biography", articleNavigationList[0].slug]),
    },
    {
      label: "Collections",
      path: buildUrl([
        "collections",
        collectionNavigationList[0].slug,
        collectionNavigationList[0].artworkId,
      ]),
    },
    { label: "Blog", path: buildUrl(["blog"], { sortby: "latest" }) },
    { label: "Project", path: buildUrl(["project", "about"]) },
    { label: "Shop", path: buildUrl(["shop"]), disabled: true },
  ];
  return <MainNav navLinks={navLinks} />;
};
