"use server";

import { buildUrl } from "@/lib/utils/urlUtils";
import { getCollectionNavigationItem } from "@/lib/data/services/getCollectionNavigationItem";
import { isNextError } from "@/lib/helpers/isNextError";
import { redirect } from "next/navigation";

export default async function CollectionSlug({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const collection = await getCollectionNavigationItem(params.slug);

    if (!collection) {
      throw new Error("Collection not found");
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

    console.error("Error in collection slug redirect:", error);
    throw error; // Let Next.js error boundary handle it
  }
}
