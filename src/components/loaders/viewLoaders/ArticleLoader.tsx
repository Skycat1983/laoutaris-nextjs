"use server";

import { buildUrl } from "@/lib/utils/urlUtils";
import { ArticleView } from "@/components/views/ArticleView";
import { getArticleBySlugPopulated } from "@/lib/data/services/getArticleBySlugPopulated";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";
import type { ArticleNavDataFrontend } from "@/lib/data/types";
import { ArticleSection } from "@/lib/constants";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";
import { notFound } from "next/navigation";

interface ArticleLoaderProps {
  slug: string;
  section: ArticleSection;
  form?: React.ReactNode;
}

type ArticleNavigation = {
  prev: string | null;
  next: string | null;
};

const logger = createServerLogger({
  component: "ArticleLoader",
  operation: "public.article.loader",
  surface: "server_loader",
});

const emptyNavigation = (): ArticleNavigation => ({
  prev: null,
  next: null,
});

const buildArticleNavigation = async ({
  slug,
  section,
}: {
  slug: string;
  section: ArticleSection;
}): Promise<ArticleNavigation> => {
  try {
    const result = await getArticleNavigationList(section);

    if (!result?.success) {
      logger.error("loader.public.article_navigation.failed", {
        slug,
        section,
        reason: result?.error ?? "No articles found",
      });
      return emptyNavigation();
    }

    const navigationList = result.data;

    if (navigationList.length === 0) {
      logger.error("loader.public.article_navigation.failed", {
        slug,
        section,
        reason: "No articles found",
      });
      return emptyNavigation();
    }

    const currentIndex = navigationList.findIndex((a) => a.slug === slug);

    if (currentIndex === -1) {
      logger.error("loader.public.article_navigation.failed", {
        slug,
        section,
        reason: "Current article missing from navigation",
      });
      return emptyNavigation();
    }

    return {
      prev:
        currentIndex > 0
          ? buildUrl([section, navigationList[currentIndex - 1].slug])
          : null,
      next:
        currentIndex < navigationList.length - 1
          ? buildUrl([section, navigationList[currentIndex + 1].slug])
          : null,
    };
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("loader.public.article_navigation.failed", {
      error,
      slug,
      section,
    });
    return emptyNavigation();
  }
};

export async function ArticleLoader({
  slug,
  section,
  form,
}: ArticleLoaderProps) {
  let article: Awaited<ReturnType<typeof getArticleBySlugPopulated>>;

  try {
    article = await getArticleBySlugPopulated(slug);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    throw new Error("Failed to fetch article");
  }

  if (!article) {
    notFound();
  }

  const navigation = await buildArticleNavigation({ slug, section });

  if (form) {
    return (
      <ArticleView article={article} navigation={navigation} form={form} />
    );
  }

  return <ArticleView article={article} navigation={navigation} />;
}
