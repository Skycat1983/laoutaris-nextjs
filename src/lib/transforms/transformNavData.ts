import { OwnUserNavDataLean, OwnUserNavFields } from "@/lib/data/types";
import { createTransformer, extendOwnUserNavFields } from "@/lib/transforms";
import {
  EXTENDED_OWN_USER_NAV_FIELDS,
  ExtendedOwnUserNavFields,
} from "@/lib/constants/navConstants";

export const transformNavigation = createTransformer<
  OwnUserNavDataLean,
  OwnUserNavFields,
  ExtendedOwnUserNavFields,
  never
>(EXTENDED_OWN_USER_NAV_FIELDS, [], extendOwnUserNavFields);
