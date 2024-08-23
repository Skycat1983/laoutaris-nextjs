import { IFrontendArtwork, Image } from "./artworkTypes";

export interface IFrontendArticle {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: any;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  overlayColour: "white" | "black";
  artwork: IFrontendReducedArticleArtwork;
}

// picking the specific fields from Image that you need
type ReducedImage = Pick<Image, "secure_url" | "pixelHeight" | "pixelWidth">;

// omiting the fields from Image that we don't need
export type IFrontendReducedArticleArtwork = Omit<
  IFrontendArtwork,
  "watcherlist" | "favourited" | "image"
> & {
  image: ReducedImage;
};
