/**
 * Article Page
 *
 * This page displays the content of an article along with navigation links to
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

import dbConnect from "@/utils/mongodb";
import { Suspense } from "react";
import ArticleViewSkeleton from "@/components/skeletons/ArticleViewSkeleton";
import ArticleView from "@/components/views/ArticleView";

export default async function Article({
  params,
}: {
  params: { articleSlug: string };
}) {
  await dbConnect();
  const slug = params.articleSlug;

  return (
    <>
      <Suspense fallback={<ArticleViewSkeleton />}>
        <ArticleView segment="biography" slug={slug} />
      </Suspense>
    </>
  );
}
