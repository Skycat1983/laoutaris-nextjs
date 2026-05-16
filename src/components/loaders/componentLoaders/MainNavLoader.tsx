import { MainNav } from "@/components/modules/navigation/mainNav/MainNav";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";
import { getCollectionNavigationList } from "@/lib/data/services/getCollectionNavigationList";
import { isNextError } from "@/lib/helpers/isNextError";
import { buildUrl } from "@/lib/utils/urlUtils";

export interface NavBarLink {
  label: string;
  path: string;
  disabled?: boolean;
}

export const MainNavLoader = async () => {
  try {
    const [articleNavigation, collectionNavigation] = await Promise.all([
      getArticleNavigationList("biography"),
      getCollectionNavigationList(),
    ]);

    if (!articleNavigation) {
      throw new Error("No articles found");
    }

    if (!collectionNavigation) {
      throw new Error("No collections found");
    }

    const { data: articleNavigationList } = articleNavigation;
    const { data: collectionNavigationList } = collectionNavigation;

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
      { label: "Shop", path: buildUrl(["shop"]) },
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
