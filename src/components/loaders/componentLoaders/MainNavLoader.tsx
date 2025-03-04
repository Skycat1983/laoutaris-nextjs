import { MainNav } from "@/components/modules/navigation/mainNav/MainNav";
import { buildUrl } from "@/lib/utils/buildUrl";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
import {
  ArticleNavItem,
  CollectionNavItem,
} from "@/lib/data/types/navigationTypes";

export interface NavBarLink {
  label: string;
  path: string;
  disabled?: boolean;
}

type MainNavFetchResults = [
  ApiResponse<ArticleNavItem[]>,
  ApiResponse<CollectionNavItem[]>
];

export const MainNavLoader = async () => {
  const [articleNavigation, collectionNavigation]: MainNavFetchResults =
    await Promise.all([
      serverPublicApi.navigation.fetchArticleNavigationList("biography"),
      serverPublicApi.navigation.fetchCollectionNavigationList(),
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

  const { data: articleNavigationList } =
    articleNavigation as ApiSuccessResponse<ArticleNavItem[]>;
  const { data: collectionNavigationList } =
    collectionNavigation as ApiSuccessResponse<CollectionNavItem[]>;

  const navLinks: NavBarLink[] = [
    {
      label: "Artwork",
      path: buildUrl(["artwork"]),
    },
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
    { label: "Blog", path: buildUrl(["blog"]) },
    { label: "Project", path: buildUrl(["project", "about"]) },
    { label: "Shop", path: buildUrl(["shop"]), disabled: true },
  ];

  // console.log("navLinks in MainNavLoader", navLinks);
  return <MainNav navLinks={navLinks} />;
};
