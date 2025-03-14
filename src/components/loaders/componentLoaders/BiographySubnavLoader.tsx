import {
  Subnav,
  SubnavLink,
} from "@/components/modules/navigation/subnav/Subnav";
import { buildUrl } from "@/lib/utils/buildUrl";
import { serverApi } from "@/lib/api/serverApi";
import { ApiArticleNavListResult } from "@/lib/api/public/navigation/fetchers";

export async function BiographySubnavLoader() {
  const result = await serverApi.public.navigation.fetchArticleNavigationList(
    "biography"
  );

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch article navigation");
  }

  const { data: articles } = result as ApiArticleNavListResult;

  const links: SubnavLink[] = articles.map((article) => ({
    label: article.title,
    slug: article.slug,
    link_to: buildUrl(["biography", article.slug]),
    disabled: false,
  }));

  return <Subnav links={links} />;
}
