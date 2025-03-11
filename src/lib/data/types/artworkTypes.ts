import {
  ExtendedPublicArtworkFields,
  SensitivePublicArtworkFields,
} from "@/lib/constants/publicDocumentConstants";
import { ArtworkDB } from "../models/artworkModel";
import { CloudinaryImageSanitized } from "./cloudinaryTypes";
import { LeanDocument, Merge, TransformedDocument } from "./utilTypes";
import {
  SENSITIVE_PUBLIC_ARTWORK_FIELDS,
  EXTENDED_PUBLIC_ARTWORK_FIELDS,
} from "@/lib/constants/publicDocumentConstants";
import {
  ArtStyle,
  FilterMode,
  Medium,
  SortOption,
  Surface,
} from "@/lib/constants/artworkConstants";
import { Decade } from "@/lib/constants/artworkConstants";

export interface ArtworkFields {
  favouriteCount: number;
  watchlistCount: number;
  isFavourited?: boolean;
  isWatchlisted?: boolean;
}

//! doc-specific transformation definitions
export type PublicArtworkTransformations = {
  DB: ArtworkDB;
  Lean: LeanDocument<PublicArtworkTransformations["DB"]>;
  Raw: TransformedDocument<PublicArtworkTransformations["Lean"]>;
  Extended: Merge<
    PublicArtworkTransformations["Raw"],
    ExtendedPublicArtworkFields
  >;
  Sanitized: Omit<
    PublicArtworkTransformations["Extended"],
    SensitivePublicArtworkFields[number]
  > & {
    image: CloudinaryImageSanitized;
  };
  Frontend: PublicArtworkTransformations["Sanitized"];
};

//! Frontend-specific types (safe)
export type PublicArtwork = PublicArtworkTransformations["Frontend"];

export interface ArtworkSortConfig {
  by: SortOption;
  color?: string; // Only used when by === 'colorProximity'
}

export interface ArtworkFilterParams {
  decade?: Decade[];
  artstyle?: ArtStyle[];
  medium?: Medium[];
  surface?: Surface[];
  limit?: number;
  page?: number;
  filterMode: FilterMode;
}

export interface ArtworkQueryParams extends ArtworkFilterParams {
  sortBy?: SortOption;
  sortColor?: string;
}

// export interface ColorInfo {
//   color: string;
//   percentage: number;
// }

// export interface PredominantColors {
//   cloudinary: ColorInfo[];
//   google: ColorInfo[];
// }

// export type SortOption =
//   | "colorProximity"
//   | "mostRecent"
//   | "mostPopular"
//   | "mostFeatured";

// From Mongoose Document to Lean
// export type ArtworkLean = LeanDocument<ArtworkDB>;
// export type ArtworkRaw = TransformedDocument<ArtworkLean>; // Should stay as ArtworkDB, not ArtworkLean
// export type ArtworkExtended = Merge<ArtworkRaw, ArtworkFields>;
// export type ArtworkSanitized = Omit<
//   ArtworkExtended,
//   "favourited" | "watcherlist" | "image"
// > & {
//   image: CloudinaryImageSanitized;
// };
//! Artwork fields
// export type Decade =
//   | "1950s"
//   | "1960s"
//   | "1970s"
//   | "1980s"
//   | "1990s"
//   | "2000s"
//   | "2010s"
//   | "2020s";

// export type ArtStyle = "abstract" | "semi-abstract" | "figurative";

// export type Medium =
//   | "oil"
//   | "acrylic"
//   | "paint"
//   | "watercolour"
//   | "pastel"
//   | "pencil"
//   | "charcoal"
//   | "ink"
//   | "sand";

// export type Surface = "paper" | "canvas" | "wood" | "film";
// export type FilterMode = "ALL" | "ANY";

// export type FilterKey = "decade" | "artstyle" | "medium" | "surface";
