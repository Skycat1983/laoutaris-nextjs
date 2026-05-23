import {
  Subnav,
  SubnavLink,
} from "@/components/modules/navigation/subnav/Subnav";
import { getCachedBiographyNavigationList } from "@/lib/data/services/getCachedBiographyArticleData";
import { buildUrl } from "@/lib/utils/urlUtils";

export async function BiographySubnavLoader() {
  const result = await getCachedBiographyNavigationList();

  if (!result) {
    throw new Error("No articles found");
  }

  const links: SubnavLink[] = result.data.map((article) => ({
    label: article.title,
    slug: article.slug,
    link_to: buildUrl(["biography", article.slug]),
    disabled: false,
  }));

  return <Subnav links={links} />;
}
