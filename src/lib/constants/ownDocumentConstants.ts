//! OWN USER

import { UserDB } from "@/lib/data/models";
import { extendOwnUserFields } from "../transforms/transformHelpers";

//! OWNUSER
// all possible user document fields
export type OwnUserFields = keyof UserDB;

// fields to actually sanitize
export const SENSITIVE_OWN_USER_FIELDS: readonly OwnUserFields[] = [
  "password",
] as const;

// indexable type of sensitive fields
export type SensitiveOwnUserFields = (typeof SENSITIVE_OWN_USER_FIELDS)[number];

// fields to extend
export const EXTENDED_OWN_USER_FIELDS: ExtendedOwnUserFields = {
  favouritedCount: 0,
  watchlistCount: 0,
  commentCount: 0,
} as const;

// type of extended fields
export type ExtendedOwnUserFields = {
  favouritedCount: number;
  watchlistCount: number;
  commentCount: number;
};

// function to extend fields
export const USER_OWN_FIELD_EXTENDER = extendOwnUserFields as (
  doc: UserDB,
  userId?: string | null
) => ExtendedOwnUserFields;
