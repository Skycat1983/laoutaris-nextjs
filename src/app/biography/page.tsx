/**
 * @fileoverview
 * This Next.js page manages the `/biography` route.
 *
 * - **Purpose:**
 *   The `/biography` route serves as an entry point for the Biography section without displaying direct content.
 *   Users accessing this route are automatically redirected to the first available biography article.
 *
 * - **Behavior:**
 *   - **Path Pattern:** `/biography/articleSlug`
 *   - When the `/biography` route is accessed, the page:
 *     1. Connects to the database.
 *     2. Fetches the path of the first available biography article using `getBiographyDefaultPath`.
 *     3. Redirects the user to `/biography/<first-article-slug>`.
 *
 * - **Error Handling:**
 *   - If no biography articles are available or the fetch operation fails, an error is thrown.
 *   - Error handling is managed via Next.js's global or route-specific `error.tsx` fallback.
 *   - TODO: Enhance error handling to provide more descriptive fallback UI or logging.
 *
 * - **Dependencies:**
 *   - `dbConnect`: Ensures a connection to MongoDB.
 *   - `redirect`: Performs a server-side redirect using Next.js's `next/navigation`.
 *   - `getBiographyDefaultPath`: Retrieves the path of the first biography article.
 *
 * - **Notes:**
 *   - Ensure that biography articles exist in the database to prevent errors.
 *   - This implementation relies on `getBiographyDefaultPath` to abstract the logic for fetching the default path.
 */

import dbConnect from "@/utils/mongodb";
import { redirect } from "next/navigation";
import { getBiographyDefaultPath } from "@/lib/server/article/use_cases/getArticleDefaultPath";

export default async function Biography() {
  await dbConnect();
  const defaultRedirectPath = await getBiographyDefaultPath();
  redirect(defaultRedirectPath);
}
