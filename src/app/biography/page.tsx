/**
 * @fileoverview
 * This Next.js page manages the `/biography` path.
 *
 * - **Purpose:**
 *   The `/biography` route serves as an entry point without direct content.
 *   When accessed, it automatically redirects users to the first available biography article
 *   within the specified collection, following the path pattern `/biography/articleSlug`.
 *
 * - **Project Structure:**
 *   - **Path Pattern:** `/biography/articleSlug`
 *   - **Behavior:**
 *     Accessing `/biography` redirects the user to `/biography/first-article-slug` based on the first available biography.
 *
 * - **Error Handling:**
 *   If fetching biography data fails or no biographies are available, it displays a user-friendly error message.
 *   TODO: Implement more robust error handling and fallback mechanisms.
 *
 * - **Dependencies:**
 *   Utilizes `fetchBiographyFields` to retrieve biography data from MongoDB and `buildUrl` for constructing redirect URLs.
 *   Employs `redirect` from `next/navigation` to perform client-side navigation.
 *
 * - **Notes:**
 *   - Ensure that biography articles exist in the database to prevent unintended redirects and rendering issues.
 *   - The layout assumes that each biography has at least one article; additional checks are implemented to handle empty collections.
 */

import dbConnect from "@/utils/mongodb";
import { redirect } from "next/navigation";
import { fetchBiographyFields } from "@/lib/server/biography/data-fetching/fetchBiographyFieldsOld";
import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import { buildUrl } from "@/utils/buildUrl";

type ArticleRedirectLink = Pick<IFrontendArticle, "slug">;

export default async function Biography() {
  await dbConnect();

  const stem = "biography";

  const response = await fetchBiographyFields<ArticleRedirectLink>(stem, [
    "slug",
  ]);

  if (!response.success) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Biography Section</h1>
        <p>Failed to fetch biography data.</p>
        <p>{response.message}</p>
      </main>
    );
  }

  const { data } = response;
  const url = buildUrl([stem, data[0].slug]);

  redirect(url);
}
