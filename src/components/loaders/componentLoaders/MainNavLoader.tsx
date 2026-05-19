import { MainNav } from "@/components/modules/navigation/mainNav/MainNav";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";
import { getCollectionNavigationList } from "@/lib/data/services/getCollectionNavigationList";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";
import { buildUrl } from "@/lib/utils/urlUtils";
import type { NavBarLink } from "@/components/modules/navigation/mainNav/types";

const logger = createServerLogger({
  component: "MainNavLoader",
  operation: "public.main_nav.loader",
  surface: "server_loader",
});

const BIOGRAPHY_PATH = buildUrl(["biography"]);
const COLLECTIONS_PATH = buildUrl(["collections"]);

const getBiographyNavPath = (
  articleNavigation: Awaited<ReturnType<typeof getArticleNavigationList>>
) => {
  const firstArticle = articleNavigation?.data.at(0);

  return firstArticle?.slug
    ? buildUrl(["biography", firstArticle.slug])
    : BIOGRAPHY_PATH;
};

const getCollectionsNavPath = (
  collectionNavigation: Awaited<ReturnType<typeof getCollectionNavigationList>>
) => {
  const firstCollection = collectionNavigation?.data.at(0);

  if (!firstCollection?.slug) {
    return COLLECTIONS_PATH;
  }

  return buildUrl([
    "collections",
    firstCollection.slug,
    firstCollection.firstArtworkId ?? "",
  ]);
};

const logRejectedNavigationResult = (
  source: "article_navigation" | "collection_navigation",
  error: unknown
) => {
  if (isNextError(error)) {
    throw error;
  }

  logger.error("loader.public.main_nav.failed", { source, error });
};

export const MainNavLoader = async () => {
  const [articleNavigationResult, collectionNavigationResult] =
    await Promise.allSettled([
      getArticleNavigationList("biography"),
      getCollectionNavigationList(),
    ]);

  const articleNavigation =
    articleNavigationResult.status === "fulfilled"
      ? articleNavigationResult.value
      : null;
  const collectionNavigation =
    collectionNavigationResult.status === "fulfilled"
      ? collectionNavigationResult.value
      : null;

  if (articleNavigationResult.status === "rejected") {
    logRejectedNavigationResult(
      "article_navigation",
      articleNavigationResult.reason
    );
  }

  if (collectionNavigationResult.status === "rejected") {
    logRejectedNavigationResult(
      "collection_navigation",
      collectionNavigationResult.reason
    );
  }

  const navLinks: NavBarLink[] = [
    {
      label: "Artwork",
      path: buildUrl(["artwork"]),
    },
    {
      label: "Biography",
      path: getBiographyNavPath(articleNavigation),
    },
    {
      label: "Collections",
      path: getCollectionsNavPath(collectionNavigation),
    },
    { label: "Blog", path: buildUrl(["blog"]) },
    { label: "Project", path: buildUrl(["project", "about"]) },
    { label: "Shop", path: buildUrl(["shop"]) },
  ];

  return <MainNav navLinks={navLinks} />;
};
