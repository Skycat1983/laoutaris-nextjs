"use server";

import { BiographySection } from "@/components/sections/BiographySection";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
import { ArticleFrontend } from "@/lib/data/types/articleTypes";
import { ApiSuccessResponse } from "@/lib/data/types/apiTypes";
import { isNextError } from "@/lib/helpers/isNextError";

export async function BiographySectionLoader() {
  try {
    console.log("Fetching biography articles...");
    const result = await serverPublicApi.article.multiple({
      section: "biography",
    });

    console.log("Biography fetch result:", result);

    if (!result.success) {
      console.error("Biography fetch failed:", result.error);
      throw new Error(result.error);
    }

    const { data: articles } = result as ApiSuccessResponse<ArticleFrontend[]>;

    if (!articles || articles.length === 0) {
      console.log("No biography articles found");
      return <div>No biography articles available.</div>;
    }

    return <BiographySection articles={articles} />;
  } catch (error) {
    if (isNextError(error)) {
      console.error("Next.js error in biography section:", error);
      throw error;
    }
    console.error("Biography section loading failed:", error);
    return (
      <div className="text-red-500 p-4">
        Error loading biography section. Please try again later.
      </div>
    );
  }
}

// Config Constants
// const BIOGRAPHY_FETCH_CONFIG = {
//   section: "biography",
//   fields: ["title", "subtitle", "slug", "imageUrl"] as const,
// } as const;

// // Type Definitions
// export type BiographyCardData = Pick<
//   FrontendArticle,
//   "title" | "subtitle" | "imageUrl" | "slug"
// >;
