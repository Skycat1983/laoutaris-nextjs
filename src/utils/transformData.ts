import { Document } from "mongoose";

export const replaceMongoId = <T extends { _id: any }>(
  document: T
): Omit<T, "_id"> & { id: string } => {
  const { _id, ...rest } = document;
  return {
    id: _id.toString(),
    ...rest,
  };
};

export const filterWatchlerlist = <T extends { watcherlist: string[] }>(
  watcherlist: T,
  userId: string
): T => {
  return {
    ...watcherlist,
    watcherlist: watcherlist.watcherlist.filter((id) => id !== userId),
  };
};

// export function transformToFrontendArticle(rawContent: any): FrontendArticleWithArtwork {
//   const { artwork, ...rest } = rawContent;

//   const transformedArtwork: FrontendArtworkUnpopulated = {
//     _id: artwork._id,
//     title: artwork.title,
//     decade: artwork.decade,
//     artstyle: artwork.artstyle,
//     medium: artwork.medium,
//     surface: artwork.surface,
//     featured: artwork.featured,
//     image: {
//       secure_url: artwork.image.secure_url,
//       pixelHeight: artwork.image.pixelHeight,
//       pixelWidth: artwork.image.pixelWidth,
//     },
//   };

//   return {
//     ...rest,
//     artwork: transformedArtwork,
//   } as FrontendArticleWithArtwork;
// }
