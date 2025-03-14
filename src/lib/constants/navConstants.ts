import {
  extendCollectionNavFields,
  extendOwnUserNavFields,
} from "../transforms";
import { CollectionDB, UserDB } from "../data/models";

//! COLLECTION
export type CollectionNavFields = Pick<
  CollectionDB,
  "title" | "slug" | "artworks"
>;
export type ExtendedCollectionNavFields = {
  firstArtworkId: string | null;
  hasArtwork: boolean;
};

export const EXTENDED_COLLECTION_NAV_FIELDS: ExtendedCollectionNavFields = {
  firstArtworkId: null,
  hasArtwork: false,
};

export const COLLECTION_NAV_FIELDS_EXTENDER = extendCollectionNavFields as (
  doc: CollectionNavFields
) => ExtendedCollectionNavFields;

//! USER
export type OwnUserNavFields = Pick<
  UserDB,
  "favourites" | "watchlist" | "comments"
>;

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
  doc: OwnUserNavFields
) => ExtendedOwnUserNavFields;
