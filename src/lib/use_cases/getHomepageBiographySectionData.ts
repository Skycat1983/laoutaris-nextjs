import { FrontendArticleMinimal } from "../client/types/articleTypes";
import { fetchArticles } from "../server/article/data-fetching/fetchArticles";

// type HomeBiographySectionData = Pick<
//   FrontendArticleMinimal,
//   "title" | "subtitle" | "imageUrl" | "slug"
// >;

// export const getHomepageBiographySectionData = async (): Promise<
//     HomeBiographySectionData[]
//     > => {
//     // await delay(2000);
//    const identifierKey = "section";
//     const identifierValue = "biography";
//     const fields = ["title", "subtitle", "slug", "imageUrl"];
