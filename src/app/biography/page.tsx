import { redirect } from "next/navigation";
import { isNextError } from "@/lib/helpers/isNextError";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";
import { createServerLogger } from "@/lib/observability/logger";
import { buildUrl } from "@/lib/utils/urlUtils";

const logger = createServerLogger({
  route: "/biography",
  operation: "public.biography.default_redirect",
  surface: "public_page",
});

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
    logger.error("page.public.biography_redirect.failed", { error });
    throw error; //  Next.js error boundary to handle it
  }
}
