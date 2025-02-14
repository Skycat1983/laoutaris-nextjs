import { Subnav } from "@/components/ui/navigation/subnav/Subnav";
import { fetchArticleNavigationList } from "@/lib/api/navigationApi";
import { buildUrl } from "@/utils/buildUrl";

export async function BiographySubnavLoader() {
  const articles = await fetchArticleNavigationList("biography");

  const links = articles.map((article) => ({
    title: article.title,
    slug: article.slug,
    link_to: buildUrl(["biography", article.slug]),
  }));

  return <Subnav links={links} />;
}
