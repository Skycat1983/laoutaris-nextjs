import { Subnav } from "@/components/modules/navigation/subnav/Subnav";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
import { buildUrl } from "@/lib/utils/buildUrl";
import { ArticleNavItem } from "@/lib/data/types/navigationTypes";
import { ApiResponse, ApiSuccessResponse } from "@/lib/data/types";
import { serverApi } from "@/lib/api/serverApi";

export async function BiographySubnavLoader() {
  const result = await serverApi.public.navigation.fetchArticleNavigationList(
    "biography"
  );

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
