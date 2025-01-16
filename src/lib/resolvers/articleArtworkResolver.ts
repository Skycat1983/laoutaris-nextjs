import {
  HexColor,
  IFrontendArtwork,
  PredominantColors,
} from "../client/types/artworkTypes";

export interface IArticlePopulatedArtwork {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: any;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  overlayColour: "white" | "black";
  artwork: IArticleArtworkFields;
}

export interface ArtworkImage {
  predominantColors: PredominantColors;
  secure_url: string;
  public_id: string;
  bytes: number;
  pixelHeight: number;
  pixelWidth: number;
  format: string;
  hexColors: HexColor[];
}

export type IArticleArtworkFields = Omit<
  IFrontendArtwork,
  "watcherlist" | "favourited" | "image"
> & {
  image: IArticleArtworkImageFields;
};

// picking the specific fields from Image that you need
export type IArticleArtworkImageFields = Pick<
  ArtworkImage,
  "secure_url" | "pixelHeight" | "pixelWidth"
>;

// export const articleArtworkResolver = ({
