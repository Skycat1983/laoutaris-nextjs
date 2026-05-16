"use server";

import { buildUrl } from "@/lib/utils/urlUtils";
import { ArticleView } from "@/components/views/ArticleView";
import { getArticleBySlugPopulated } from "@/lib/data/services/getArticleBySlugPopulated";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";
import {
  ArticleFrontendPopulated,
  ArticleNavDataFrontend,
  ApiResponse,
  ApiSuccessResponse,
} from "@/lib/data/types";
import { ArticleSection } from "@/lib/constants";
import { isNextError } from "@/lib/helpers/isNextError";

interface ArticleLoaderProps {
  slug: string;
  section: ArticleSection;
  form?: React.ReactNode;
}

type FetcherResponses = [
  ApiResponse<ArticleFrontendPopulated>,
  ApiResponse<ArticleNavDataFrontend[]>
];

const fetchArticleDetail = async (
  slug: string
): Promise<ApiResponse<ArticleFrontendPopulated>> => {
  try {
    const result = await getArticleBySlugPopulated(slug);

    if (!result) {
      return {
        success: false,
        error: "Article not found",
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    return {
      success: false,
      error: "Failed to fetch article",
    };
  }
};

const fetchArticleNavigation = async (
  section: ArticleSection
): Promise<ApiResponse<ArticleNavDataFrontend[]>> => {
  try {
    const result = await getArticleNavigationList(section);

    if (!result) {
      return {
        success: false,
        error: "No articles found",
      };
    }

    return result;
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    return {
      success: false,
      error: "Failed to fetch article navigation",
    };
  }
};

export async function ArticleLoader({
  slug,
  section,
  form,
}: ArticleLoaderProps) {
  const [articleResponse, navigationResponse] = (await Promise.all([
    fetchArticleDetail(slug),
    fetchArticleNavigation(section),
  ])) as FetcherResponses;

  if (!articleResponse.success) {
    throw new Error(articleResponse.error || "Failed to fetch article");
  }

  if (!navigationResponse.success) {
    throw new Error(
      navigationResponse.error || "Failed to fetch article navigation"
    );
  }

  const { data: article } =
    articleResponse as ApiSuccessResponse<ArticleFrontendPopulated>;

  const { data: navigationList } = navigationResponse as ApiSuccessResponse<
    ArticleNavDataFrontend[]
  >;

  // Find current article index
  const currentIndex = navigationList.findIndex((a) => a.slug === slug);

  // Build navigation links
  const navigation = {
    prev:
      currentIndex > 0
        ? buildUrl([section, navigationList[currentIndex - 1].slug])
        : null,
    next:
      currentIndex < navigationList.length - 1
        ? buildUrl([section, navigationList[currentIndex + 1].slug])
        : null,
  };

  if (form) {
    return (
      <ArticleView article={article} navigation={navigation} form={form} />
    );
  }

  return <ArticleView article={article} navigation={navigation} />;
}
