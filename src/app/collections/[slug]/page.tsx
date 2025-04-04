"use server";

import { buildUrl } from "@/lib/utils/urlUtils";

import { serverApi } from "@/lib/api/serverApi";
import { redirect } from "next/navigation";

export default async function CollectionSlug({
  params,
}: {
  params: { slug: string };
}) {
  try {
    console.log("params slug in collection slug page", params.slug);
    // Fetch the specific collection
    const result =
      await serverApi.public.navigation.fetchCollectionNavigationItem(
        params.slug
      );

    if (!result.success) {
      throw new Error(result.error);
    }

    const collection = result.data;

    // Build and redirect to the full path
    const redirectPath = buildUrl([
      "collections",
      collection.slug,
      collection.firstArtworkId || "",
    ]);

    return redirect(redirectPath);
  } catch (error) {
    console.error("Error in collection slug redirect:", error);
    throw error; // Let Next.js error boundary handle it
  }
}
