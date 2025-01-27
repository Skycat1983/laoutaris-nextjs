import { FrontendUserFull } from "./userTypes";

export type FrontendArtwork =
  | FrontendArtworkFull
  | FrontendArtworkUnpopulated
  | FrontendArtworkWithWatcherlist
  | FrontendArtworkWithFavourited;

export interface FrontendArtworkFull {
  _id: string;
  image: ArtworkImage;
  title: string;
  decade: number;
  artstyle: string;
  medium: string;
  surface: string;
  featured: boolean;
  watcherlist: FrontendUserFull[];
  favourited: FrontendUserFull[];
}

export interface FrontendArtworkUnpopulated {
  _id: string;
  image: ArtworkImage;
  title: string;
  decade: string;
  artstyle: string;
  medium: string;
  surface: string;
  featured: boolean;
  watcherlist: string[];
  favourited: string[];
}

export interface FrontendArtworkWithWatcherlist {
  _id: string;
  image: ArtworkImage;
  title: string;
  decade: string;

  artstyle: string;
  medium: string;
  surface: string;
  featured: boolean;
  watcherlist: FrontendUserFull[];
  favourited: string[];
}

export interface FrontendArtworkWithFavourited {
  _id: string;
  image: ArtworkImage;
  title: string;
  decade: string;

  artstyle: string;
  medium: string;
  surface: string;
  featured: boolean;
  watcherlist: string[];
  favourited: FrontendUserFull[];
}

export interface ArtworkImage {
  secure_url: string;
  public_id: string;
  predominantColors: PredominantColors;
  pixelHeight: number;
  pixelWidth: number;
  hexColors: HexColor[];
  format: string;
  bytes: number;
}

export interface PredominantColors {
  cloudinary: CloudinaryColor[];
  google: GoogleColor[];
}

export interface CloudinaryColor {
  color: string;
  percentage: number;
  // _id: string;
}

export interface GoogleColor {
  color: string;
  percentage: number;
  // _id: string;
}

export interface HexColor {
  color: string;
  percentage: number;
  // _id: string;
}
