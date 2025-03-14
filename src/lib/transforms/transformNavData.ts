import {
  ArticleSelectFieldsLean,
  CollectionSelectFieldsLean,
  OwnUserSelectFieldsLean,
} from "@/lib/data/types";
import { createTransformer } from "@/lib/transforms";
import {
  BIOGRAPHY_NAV_FIELDS_EXTENDER,
  COLLECTION_NAV_FIELDS_EXTENDER,
  EXTENDED_BIOGRAPHY_NAV_FIELDS,
  EXTENDED_COLLECTION_NAV_FIELDS,
  EXTENDED_OWN_USER_NAV_FIELDS,
  ExtendedBiographyNavFields,
  ExtendedCollectionNavFields,
  ExtendedOwnUserNavFields,
  OWN_USER_NAV_FIELDS_EXTENDER,
} from "@/lib/constants/navConstants";

// ! BIOGRAPHY NAV TRANSFORMER
export const transformBiographyNav = createTransformer<
  ArticleSelectFieldsLean,
  ArticleSelectFieldsLean,
  ExtendedBiographyNavFields,
  never
>(EXTENDED_BIOGRAPHY_NAV_FIELDS, [], BIOGRAPHY_NAV_FIELDS_EXTENDER);

//! COLLECTION NAV TRANSFORMER
export const transformCollectionNav = createTransformer<
  CollectionSelectFieldsLean,
  CollectionSelectFieldsLean,
  ExtendedCollectionNavFields,
  never
>(EXTENDED_COLLECTION_NAV_FIELDS, [], COLLECTION_NAV_FIELDS_EXTENDER);

// ! ACCOUNT NAV TRANSFORMER
export const transformAccountNav = createTransformer<
  OwnUserSelectFieldsLean,
  OwnUserSelectFieldsLean,
  ExtendedOwnUserNavFields,
  never
>(EXTENDED_OWN_USER_NAV_FIELDS, [], OWN_USER_NAV_FIELDS_EXTENDER);

// type ExtendedNavFields = {
//   segments: NavSegment[];
// };

// const EXTENDED_NAV_FIELDS: ExtendedNavFields = {
//   segments: [],
// };

// // Calculate the segments
// const calculateNavFields = (doc: OwnUserSelectFields): ExtendedNavFields => ({
//   segments: [
//     {
//       baseSegment: "account",
//       slug: "favourites",
//       docId: doc.favourites[0]?.toString(),
//       label: "Favourites",
//       disabled: doc.favourites.length === 0,
//     },
//     {
//       baseSegment: "account",
//       slug: "watchlist",
//       docId: doc.watchlist[0]?.toString(),
//       label: "Watchlist",
//       disabled: doc.watchlist.length === 0,
//     },
//     {
//       baseSegment: "account",
//       slug: "comments",
//       label: "Comments",
//       disabled: doc.comments.length === 0,
//     },
//   ],
// });

// // Biography Navigation
// export type BiographyNavFields = Pick<ArticleDB, "title" | "slug">;
// export const transformBiographyNav: NavTransformer<BiographyNavFields> = {
//   toSegments: (doc) => [
//     {
//       baseSegment: "biography",
//       slug: doc.slug,
//       label: doc.title,
//       disabled: false,
//     },
//   ],
// };

// // Collections Navigation
// export type CollectionNavFields = Pick<
//   CollectionDB,
//   "title" | "slug" | "artworks"
// >;
// export const transformCollectionNav: NavTransformer<CollectionNavFields> = {
//   toSegments: (doc) => [
//     {
//       baseSegment: "collections",
//       slug: doc.slug,
//       docId: doc.artworks[0]?.toString() || undefined,
//       label: doc.title,
//       disabled: doc.artworks.length === 0,
//     },
//   ],
// };

// // Account Navigation
// export type OwnUserNavFields = Pick<
//   UserDB,
//   "favourites" | "watchlist" | "comments"
// >;
// export const transformAccountNav: NavTransformer<OwnUserNavFields> = {
//   toSegments: (doc) => [
//     {
//       baseSegment: "account",
//       slug: "favourites",
//       docId: doc.favourites[0]?.toString(),
//       label: "Favourites",
//       disabled: doc.favourites.length === 0,
//     },
//     {
//       baseSegment: "account",
//       slug: "watchlist",
//       docId: doc.watchlist[0]?.toString(),
//       label: "Watchlist",
//       disabled: doc.watchlist.length === 0,
//     },
//     {
//       baseSegment: "account",
//       slug: "comments",
//       label: "Comments",
//       disabled: doc.comments.length === 0,
//     },
//   ],
// };
