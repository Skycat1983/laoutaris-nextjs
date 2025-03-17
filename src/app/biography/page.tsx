import { serverApi } from "@/lib/api/serverApi";
import { buildUrl } from "@/lib/utils/buildUrl";
import { redirect } from "next/navigation";
import { isNextError } from "@/lib/helpers/isNextError";
export default async function BiographyPage() {
  try {
    // Fetch the list of biography articles
    const result = await serverApi.public.navigation.fetchArticleNavigationList(
      "biography"
    );

    if (!result.success) {
      throw new Error(result.message);
    }

    const articles = result.data;

    // If no articles found, throw an error
    if (!articles.length) {
      throw new Error("No biography articles found");
    }

    // Get the first article's slug and build the redirect path
    const defaultRedirectPath = buildUrl(["biography", articles[0].slug]);

    // Redirect to the first article
    return redirect(defaultRedirectPath);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Error in biography default path:", error);
    throw error; //  Next.js error boundary to handle it
  }
}
