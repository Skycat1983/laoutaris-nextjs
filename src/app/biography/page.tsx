import { fetchArticleNavigationList } from "@/lib/api/navigationApi";
import { buildUrl } from "@/utils/buildUrl";
import { redirect } from "next/navigation";

/**
 * Biography Page Route
 *
 * Handles the `/biography` route by redirecting to the first available biography article.
 *
 * @route GET /biography
 *
 * Flow:
 * 1. Fetches list of biography articles using navigation API
 * 2. Redirects to the first article's full path
 *
 * Error Handling:
 * - Throws if no articles are found
 * - Throws if API request fails
 * - Handled by Next.js error boundary
 *
 * @throws {Error} When no articles are found or API fails
 */
export default async function Biography() {
  try {
    // Fetch the list of biography articles
    const articles = await fetchArticleNavigationList("biography");

    // If no articles found, throw an error
    if (!articles.length) {
      throw new Error("No biography articles found");
    }

    // Get the first article's slug and build the redirect path
    const defaultRedirectPath = buildUrl(["biography", articles[0].slug]);

    // Redirect to the first article
    return redirect(defaultRedirectPath);
  } catch (error) {
    console.error("Error in biography default path:", error);
    throw error; //  Next.js error boundary to handle it
  }
}
