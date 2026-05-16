import { getCollectionNavigationList } from "@/lib/data/services/getCollectionNavigationList";
import { redirect } from "next/navigation";
import { isNextError } from "@/lib/helpers/isNextError";
import { buildUrl } from "@/lib/utils/urlUtils";

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
    console.error("Error in collections default path:", error);
    throw error; // Let Next.js error boundary handle it
  }
}
