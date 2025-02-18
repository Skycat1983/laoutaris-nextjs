import { FrontendArticleWithArtworkTooltip } from "../../../../src/lib/transforms/articleToPublic";
import { PrevNextLinks } from "../resolvers/articlesToPrevNext";
import { getArticle } from "./getArticle";
import { getArticlePrevNextLinks } from "./getArticlePrevNextLinks";

export interface ArticlePageData {
  article: FrontendArticleWithArtworkTooltip;
  navigation: PrevNextLinks;
}

export const getArticlePageData = async ({
  segment,
  slug,
}: {
  segment: string;
  slug: string;
}): Promise<ArticlePageData> => {
  const articleDetails = getArticle({ segment, slug });
  const relativeLinks = getArticlePrevNextLinks({ segment, slug });

  const [article, navigation] = await Promise.all([
    articleDetails,
    relativeLinks,
  ]);

  return { article, navigation };
};
