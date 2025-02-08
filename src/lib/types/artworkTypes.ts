import { FrontendUser } from "./userTypes";
import { ColorInfo } from "./colorTypes";

interface BaseFrontendArtwork {
  _id: string;
  title: string;
  image: ArtworkImage;
  decade: Decade;
  artstyle: ArtStyle;
  medium: Medium;
  surface: Surface;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type PopulatedField<T> = string | T;

export interface FrontendArtwork extends BaseFrontendArtwork {
  watcherlist: PopulatedField<FrontendUser>[];
  favourited: PopulatedField<FrontendUser>[];
}

export type Decade =
  | "1950s"
  | "1960s"
  | "1970s"
  | "1980s"
  | "1990s"
  | "2000s"
  | "2010s"
  | "2020s";

export type ArtStyle = "abstract" | "semi-abstract" | "figurative";

export type Medium =
  | "oil"
  | "acrylic"
  | "paint"
  | "watercolour"
  | "pastel"
  | "pencil"
  | "charcoal"
  | "ink"
  | "sand";

export type Surface = "paper" | "canvas" | "wood" | "film";

export interface FrontendArtworkFull {
  _id: string;
  image: ArtworkImage;
  title: string;
  decade: Decade;
  artstyle: ArtStyle;
  medium: Medium;
  surface: Surface;
  featured: boolean;
  watcherlist: FrontendUserFull[];
  favourited: FrontendUserFull[];
}

export interface FrontendArtworkUnpopulated {
  _id: string;
  image: ArtworkImage;
  title: string;
  decade: Decade;
  artstyle: ArtStyle;
  medium: Medium;
  surface: Surface;
  featured: boolean;
  watcherlist: string[];
  favourited: string[];
}

export interface FrontendArtworkWithWatcherlist {
  _id: string;
  image: ArtworkImage;
  title: string;
  decade: Decade;
  artstyle: ArtStyle;
  medium: Medium;
  surface: Surface;
  featured: boolean;
  watcherlist: FrontendUserFull[];
  favourited: string[];
}

export interface FrontendArtworkWithFavourited {
  _id: string;
  image: ArtworkImage;
  title: string;
  decade: Decade;
  artstyle: ArtStyle;
  medium: Medium;
  surface: Surface;
  featured: boolean;
  watcherlist: string[];
  favourited: FrontendUserFull[];
}

export interface ArtworkImage {
  secure_url: string;
  public_id: string;
  bytes: number;
  pixelHeight: number;
  pixelWidth: number;
  format: string;
  hexColors: ColorInfo[];
  predominantColors: PredominantColors;
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
