import { ArticleLeanPopulated } from "@/lib/data/types";

// export const extendedArticleFields = (
//   article: ArticleLeanPopulated,
// ): ArticleExtendedFields => {
//   return { ...article, author: article.author, artwork: article.artwork };
// };
function extendArtworkPopulated(
  sanitizedArtwork: ArtworkSanitizedPopulated,
  leanArtwork: ArtworkLeanPopulated
): ArtworkFrontendPopulated {
  return {
    ...sanitizedArtwork, // Keep all sanitized properties
    isFavourited: leanArtwork.favourited.includes(leanArtwork._id),
    favouriteCount: leanArtwork.favourited.length,
    isWatchlisted: leanArtwork.watcherlist.includes(leanArtwork._id),
    watchlistCount: leanArtwork.watcherlist.length,
    collections: [], // Handle collections if needed
    watcherlist: leanArtwork.watcherlist.map((user) => extendUser(user)),
    favourited: leanArtwork.favourited.map((user) => extendUser(user)),
  };
}
