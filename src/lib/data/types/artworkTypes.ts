import {
  SensitivePublicArtworkFields,
  ExtendedPublicArtworkFields,
} from "@/lib/constants/publicDocumentConstants";
import { ArtworkDB } from "../models/artworkModel";
import { CloudinaryImageSanitized } from "./cloudinaryTypes";
import { LeanDocument, Merge, TransformedDocument } from "./utilTypes";
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
