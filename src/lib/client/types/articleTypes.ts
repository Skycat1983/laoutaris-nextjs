import { FrontendArtworkFull } from "./artworkTypes";
import { FrontendUserFull } from "./userTypes";

export interface FrontendArticleFull {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: FrontendUserFull;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  overlayColour: "white" | "black";
  artwork: FrontendArtworkFull;
}

export interface FrontendArticleMinimal {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: string;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  overlayColour: "white" | "black";
  artwork: string;
}

export interface FrontendArticleWithAuthor {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: FrontendUserFull;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  overlayColour: "white" | "black";
  artwork: string;
}

export interface FrontendArticleWithArtwork {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: string;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  overlayColour: "white" | "black";
  artwork: FrontendArtworkFull;
}

//! OLD TYPES BELOW:
//* TRYING WITH FULL USER TYPE

// export interface FrontendArticle {
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   author: mongoose.Schema.Types.ObjectId;
//   imageUrl: string;
//   slug: string;
//   section: "artwork" | "biography" | "project";
//   overlayColour: "white" | "black";
//   artwork: IFrontendReducedArticleArtwork;
// }

// // omiting the fields from Image that we don't need
// export type IFrontendReducedArticleArtwork = Omit<
//   IFrontendArtwork,
//   "watcherlist" | "favourited" | "image"
// > & {
//   image: ReducedImage;
// };

// // picking the specific fields from Image that you need
// type ReducedImage = Pick<
//   ArtworkImage,
//   "secure_url" | "pixelHeight" | "pixelWidth"
// >;
