import { buildUrl } from "@/lib/utils/urlUtils";
import { getCollectionNavigationItem } from "@/lib/data/services/getCollectionNavigationItem";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const logger = createServerLogger({
  route: "/collections/[slug]",
  operation: "public.collection_slug.redirect",
  surface: "public_page",
});

export default async function CollectionSlug({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const collection = await getCollectionNavigationItem(params.slug);

    if (!collection) {
      notFound();
    }

    const redirectPath = buildUrl([
      "collections",
      collection.slug,
      collection.firstArtworkId || "",
    ]);

    return redirect(redirectPath);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("page.public.collection_slug_redirect.failed", {
      error,
      slug: params.slug,
    });
    throw error; // Let Next.js error boundary handle it
  }
}
