/**
 * @fileoverview
 * This Next.js page manages the `/biography/[articleSlug]` path.
 *
 * - **Purpose:**
 *   The `Article` component fetches a specific biography article based on the provided `articleSlug`.
 *   It also retrieves additional biography articles to facilitate navigation between them.
 *   The component renders either a `MobileArticleView` or an `ArticleView` depending on the device viewport.
 *
 * - **Project Structure:**
 *   - **Path Pattern:** `/biography/[articleSlug]`
 *   - **Behavior:**
 *     - **Data Fetching:**
 *       - Retrieves the current biography article using the `articleSlug`.
 *       - Fetches all biography article links to enable pagination and navigation.
 *     - **Navigation:**
 *       - Determines the previous and next articles based on the current article's position in the fetched list.
 *       - Constructs URLs for navigating to adjacent articles.
 *
 * - **Error Handling:**
 *   If fetching the current article or the biography links fails, the component displays a user-friendly error message.
 *   TODO: Implement more detailed error messages and possibly retry mechanisms for failed fetch attempts.
 *
 * - **Dependencies:**
 *   Utilizes `fetchArticles` to retrieve biography data from MongoDB.
 *   Renders the following components with the fetched data:
 *     - `MobileArticleView`: Displays the article optimized for mobile devices.
 *     - `ArticleView`: Displays the article optimized for desktop devices.
 */

import dbConnect from "@/utils/mongodb";
import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import { fetchArticles } from "@/lib/server/article/data-fetching/fetchArticles";
import { fetchArticleArtwork } from "@/lib/server/article/data-fetching/fetchArticleArtwork";
import { delay } from "@/utils/debug";
import { buildUrl } from "@/utils/buildUrl";
import ArticleView from "@/views/ArticleView";
import MobileArticleView from "@/views/MobileArticleView";

type BiographyArticleLink = Pick<IFrontendArticle, "slug">;

export default async function Article({
  params,
}: {
  params: { articleSlug: string };
}) {
  await dbConnect();
  await delay(2000);
  const currentArticleSlug = params.articleSlug;
  const stem = "biography";

  // Define the fetch parameters for the current article and all biography links
  const currentArticleFetch = fetchArticleArtwork<IFrontendArticle>(
    "slug",
    currentArticleSlug,
    [],
    ["image.secure_url", "image.pixelHeight", "image.pixelWidth"]
  );

  const biographyLinksFetch = fetchArticles<BiographyArticleLink>(
    "section",
    "biography",
    ["slug"]
  );

  // Fetch both the current article and biography links concurrently
  const [currentArticleResponse, biographyLinksResponse] = await Promise.all([
    currentArticleFetch,
    biographyLinksFetch,
  ]);

  // Handle unsuccessful fetch
  if (!currentArticleResponse.success || !biographyLinksResponse.success) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-3xl font-bold">Biography Article</h1>
        <p className="mt-4">Failed to load the biography article.</p>
        <p>
          {!currentArticleResponse.success && currentArticleResponse.message}
        </p>
        <p>
          {!biographyLinksResponse.success && biographyLinksResponse.message}
        </p>
      </main>
    );
  }

  const currentArticle = currentArticleResponse.data;
  const biographyLinks = biographyLinksResponse.data;

  // Ensure that biographyLinks includes the current article
  const currentIndex = biographyLinks.findIndex(
    (link) => link.slug === currentArticleSlug
  );

  // Determine previous and next articles based on the current index
  const prevLink =
    currentIndex > 0 ? biographyLinks[currentIndex - 1].slug : null;
  const nextLink =
    currentIndex < biographyLinks.length - 1
      ? biographyLinks[currentIndex + 1].slug
      : null;

  // Construct URLs for navigation
  const prevUrl = prevLink ? buildUrl([stem, prevLink]) : null;
  const nextUrl = nextLink ? buildUrl([stem, nextLink]) : null;

  return (
    <main className="flex flex-col items-center justify-between lg:px-12 py-4">
      {/* Render MobileArticleView for mobile devices */}
      <div className="block md:hidden">
        <MobileArticleView
          article={currentArticle}
          nextUrl={nextUrl}
          prevUrl={prevUrl}
        />
      </div>

      {/* Render ArticleView for desktop devices */}
      <div className="hidden md:block">
        <ArticleView
          article={currentArticle}
          nextUrl={nextUrl}
          prevUrl={prevUrl}
        />
      </div>
    </main>
  );
}
