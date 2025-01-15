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
 *   Utilizes `fetchArticles` to retrieve biography data from MongoDB and `buildUrl` for constructing redirect URLs.
 *   Employs `redirect` from `next/navigation` to perform client-side navigation.
 *
 * - **Notes:**
 *   - Ensure that biography articles exist in the database to prevent unintended redirects and rendering issues.
 *   - The layout assumes that each biography has at least one article; additional checks are implemented to handle empty collections.
 */

import dbConnect from "@/utils/mongodb";
import { getBiographyDefaultRedirect } from "@/lib/use_cases/getBiographyRedirect";
import { redirect } from "next/navigation";

export default async function Biography() {
  await dbConnect();
  // return getBiographyDefaultRedirect();
  const defaultRedirect = await getBiographyDefaultRedirect();
  redirect(defaultRedirect);
}

// type ArticleSlug = Pick<IFrontendArticle, "slug">;

// const subnavData = await getBiographySubNavData();

// const stem = "biography";

// const response = await fetchArticles<ArticleSlug[]>("section", stem, [
//   "slug",
// ]);

// if (!response.success || !response.data || response.data.length === 0) {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <h1>Biography Section</h1>
//       <p>Failed to fetch biography data.</p>
//       <p>{response.message}</p>
//     </main>
//   );
// }

// const { data } = response;
// const url = subnavData[0].link_to;

// redirect(url);
