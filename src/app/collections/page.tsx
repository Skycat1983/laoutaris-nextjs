import { getCollectionNavigationList } from "@/lib/data/services/getCollectionNavigationList";
import { redirect } from "next/navigation";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";
import { buildUrl } from "@/lib/utils/urlUtils";

const logger = createServerLogger({
  route: "/collections",
  operation: "public.collections.default_redirect",
  surface: "public_page",
});

export default async function Collections() {
  try {
    const result = await getCollectionNavigationList();

    if (!result || !result.data.length) {
      throw new Error("No collections found");
    }

    const firstCollection = result.data[0];
    const defaultRedirectPath = buildUrl([
      "collections",
      firstCollection.slug,
      firstCollection.firstArtworkId ?? "",
    ]);

    return redirect(defaultRedirectPath);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    logger.error("page.public.collections_redirect.failed", { error });
    throw error; // Let Next.js error boundary handle it
  }
}
