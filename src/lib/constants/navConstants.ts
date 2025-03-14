import {
  ArticleSelectFieldsLean,
  CollectionSelectFieldsLean,
  OwnUserSelectFieldsLean,
} from "../data/types";
import {
  extendBiographyNavFields,
  extendCollectionNavFields,
  extendOwnUserNavFields,
} from "../transforms";
import { transformCollectionNav } from "../transforms/transformNavData";

type BaseSement = "biography" | "collections" | "account";

interface NavSegment {
  baseSegment: BaseSement;
  slug: string;
  docId?: string;
}

//! BIOGRAPHY

export type ExtendedBiographyNavFields = {};

export const EXTENDED_BIOGRAPHY_NAV_FIELDS: ExtendedBiographyNavFields = {};

export const BIOGRAPHY_NAV_FIELDS_EXTENDER = extendBiographyNavFields as (
  doc: ArticleSelectFieldsLean
) => ExtendedBiographyNavFields;

//! COLLECTIONS
export type ExtendedCollectionNavFields = {
  firstArtworkId: string | null;
  hasArtwork: boolean;
};

export const EXTENDED_COLLECTION_NAV_FIELDS: ExtendedCollectionNavFields = {
  firstArtworkId: null,
  hasArtwork: false,
};

export const COLLECTION_NAV_FIELDS_EXTENDER = extendCollectionNavFields as (
  doc: CollectionSelectFieldsLean
) => ExtendedCollectionNavFields;

//! ACCOUNT

export type ExtendedOwnUserNavFields = {
  firstFavouriteId: string | null;
  firstWatchlistId: string | null;
  firstCommentId: string | null;
  hasFavourites: boolean;
  hasWatchlist: boolean;
  hasComments: boolean;
};

export const EXTENDED_OWN_USER_NAV_FIELDS: ExtendedOwnUserNavFields = {
  firstFavouriteId: null,
  firstWatchlistId: null,
  firstCommentId: null,
  hasFavourites: false,
  hasWatchlist: false,
  hasComments: false,
};

export const OWN_USER_NAV_FIELDS_EXTENDER = extendOwnUserNavFields as (
  doc: OwnUserSelectFieldsLean
) => ExtendedOwnUserNavFields;
