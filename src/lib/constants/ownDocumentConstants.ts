//! OWN USER

import { UserDB } from "@/lib/data/models";
import { extendOwnUserFields } from "../transforms/transformHelpers";

//! OWNUSER
// all possible user document fields
type OwnUserFields = keyof UserDB;

// fields to actually sanitize
const SENSITIVE_OWN_USER_FIELDS: readonly OwnUserFields[] = [
  "password",
] as const;

// indexable type of sensitive fields
type SensitiveOwnUserFields = (typeof SENSITIVE_OWN_USER_FIELDS)[number];

// fields to extend
const EXTENDED_OWN_USER_FIELDS: ExtendedOwnUserFields = {
  favouritedCount: 0,
  watchlistCount: 0,
  commentCount: 0,
} as const;

// type of extended fields
type ExtendedOwnUserFields = {
  favouritedCount: number;
  watchlistCount: number;
  commentCount: number;
};

// function to extend fields
const USER_OWN_FIELD_EXTENDER = extendOwnUserFields as (
  doc: UserDB,
  userId?: string | null
) => ExtendedOwnUserFields;

export {
  SENSITIVE_OWN_USER_FIELDS,
  EXTENDED_OWN_USER_FIELDS,
  USER_OWN_FIELD_EXTENDER,
};

export type { OwnUserFields, SensitiveOwnUserFields, ExtendedOwnUserFields };
