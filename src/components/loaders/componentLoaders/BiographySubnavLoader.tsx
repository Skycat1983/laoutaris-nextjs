import { Subnav } from "@/components/modules/navigation/subnav/Subnav";
import { serverApi } from "@/lib/api/server";
import { buildUrl } from "@/lib/utils/buildUrl";
import { ArticleNavItem } from "@/lib/data/types/navigationTypes";
export async function BiographySubnavLoader() {
  const result: ApiResponse<ArticleNavItem[]> =
    await serverApi.navigation.fetchArticleNavigationList("biography");

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch article navigation");
  }

  const { data: articles } = result as ApiSuccessResponse<ArticleNavItem[]>;

  const links = articles.map((article) => ({
    title: article.title,
    slug: article.slug,
    link_to: buildUrl(["biography", article.slug]),
  }));

  return <Subnav links={links} />;
}

// ! this is a loader for the biography subnav
// ! it fetches the article navigation list for the biography section
// ! it then maps the articles to the subnav links
// ! it then returns the subnav component with the links
// ! the subnav component is a component that displays a list of links
