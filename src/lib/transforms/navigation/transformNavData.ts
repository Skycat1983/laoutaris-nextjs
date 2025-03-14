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
