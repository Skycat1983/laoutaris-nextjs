import { redirect } from "next/navigation";
import { isNextError } from "@/lib/helpers/isNextError";
import {
  BIOGRAPHY_CACHE_REVALIDATE_SECONDS,
  getCachedBiographyNavigationList,
} from "@/lib/data/services/getCachedBiographyArticleData";
import { createServerLogger } from "@/lib/observability/logger";
import { buildUrl } from "@/lib/utils/urlUtils";

export const revalidate = BIOGRAPHY_CACHE_REVALIDATE_SECONDS;

const logger = createServerLogger({
  route: "/biography",
  operation: "public.biography.default_redirect",
  surface: "public_page",
});

export default async function BiographyPage() {
  try {
    const result = await getCachedBiographyNavigationList();

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
