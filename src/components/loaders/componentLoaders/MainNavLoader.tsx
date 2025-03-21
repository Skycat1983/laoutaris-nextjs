import { MainNav } from "@/components/modules/navigation/mainNav/MainNav";
import { buildUrl } from "@/lib/utils/buildUrl";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
import {
  ArticleNavDataFrontend,
  CollectionNavDataFrontend,
} from "@/lib/data/types";
import { ApiSuccessResponse, ApiErrorResponse } from "@/lib/data/types";
import {
  ApiArticleNavListResult,
  ApiCollectionNavListResult,
} from "@/lib/api/public/navigation/fetchers";
import { isNextError } from "@/lib/helpers/isNextError";
import dbConnect from "@/lib/db/mongodb";
import { serverApi } from "@/lib/api/serverApi";
export interface NavBarLink {
  label: string;
  path: string;
  disabled?: boolean;
}

type ArticleNavResult = ApiArticleNavListResult | ApiErrorResponse;
type CollectionNavResult = ApiCollectionNavListResult | ApiErrorResponse;

type MainNavFetchResults = [ArticleNavResult, CollectionNavResult];

export const MainNavLoader = async () => {
  try {
    await dbConnect();

    const [articleNavigation, collectionNavigation]: MainNavFetchResults =
      await Promise.all([
        serverApi.public.navigation.fetchArticleNavigationList("biography"),
        serverApi.public.navigation.fetchCollectionNavigationList(),
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
      articleNavigation as ApiSuccessResponse<ArticleNavDataFrontend[]>;
    const { data: collectionNavigationList } =
      collectionNavigation as ApiSuccessResponse<CollectionNavDataFrontend[]>;

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
          collectionNavigationList[0].firstArtworkId ?? "",
        ]),
      },
      { label: "Blog", path: buildUrl(["blog"]) },
      { label: "Project", path: buildUrl(["project", "about"]) },
      { label: "Shop", path: buildUrl(["shop"]), disabled: true },
    ];

    return <MainNav navLinks={navLinks} />;
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    } else {
      console.error("Error in MainNavLoader", error);
    }
  }
};
