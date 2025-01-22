/**
 * ArticleView
 *
 * This server component displays the content of an article along with navigation links to
 * the previous and next articles within the same section. It uses server-side
 * data fetching for dynamic content and supports both mobile and desktop layouts.
 *
 * Workflow:
 * 1. Establish a database connection (`dbConnect`).
 * 2. Introduce an artificial delay (`delay`) for debugging purpose and test skeleton
 * 3. Fetch the current article details using `getArticleView`.
 * 4. Fetch navigation links for the previous and next articles using `getPrevNextArticleLinks`.
 * 5. Render the content with responsive layouts (`MobileArticleView` and `ArticleView`).
 *
 * @param {Object} params - Route parameters passed to the page.
 * @param {string} params.articleSlug - The slug of the article to be displayed.
 * @returns {JSX.Element} The rendered article page.
 */

import React from "react";
import MobileArticleView from "./MobileArticleView";
import DesktopArticleView from "./DesktopArticleView";
import { delay } from "@/utils/debug";
import { getArticlePageData } from "@/lib/server/article/use_cases/getArticlePageData";

type ArticleViewProps = {
  segment: string;
  slug: string;
};

const ArticleView = async ({ segment, slug }: ArticleViewProps) => {
  // await delay(2000);
  const { article, navigation } = await getArticlePageData({ segment, slug });

  const { prev, next } = navigation;
  return (
    <main className="flex flex-col items-center justify-between lg:px-12 py-4">
      <div className="block md:hidden">
        <MobileArticleView article={article} nextUrl={next} prevUrl={prev} />
      </div>

      <div className="hidden md:block">
        <DesktopArticleView
          article={article}
          nextArticle={next}
          prevArticle={prev}
        />
      </div>
    </main>
  );
};

export default ArticleView;
