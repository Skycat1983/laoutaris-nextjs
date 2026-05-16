import { redirect } from "next/navigation";
import { isNextError } from "@/lib/helpers/isNextError";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";
import { buildUrl } from "@/lib/utils/urlUtils";

export default async function BiographyPage() {
  try {
    const result = await getArticleNavigationList("biography");

    if (!result || !result.data.length) {
      throw new Error("No biography articles found");
    }

    const defaultRedirectPath = buildUrl(["biography", result.data[0].slug]);

    return redirect(defaultRedirectPath);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Error in biography default path:", error);
    throw error; //  Next.js error boundary to handle it
  }
}
