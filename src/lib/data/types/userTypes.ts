import { UserDB } from "../models";
import { PublicArtworkTransformations } from "./artworkTypes";
import {
  LeanDocument,
  Merge,
  TransformedDocument,
  WithPopulatedFields,
} from "./utilTypes";

export type UserExtensionFields = {
  isOnline?: boolean;
};

const SENSITIVE_PUBLIC_USER_FIELDS = ["password", "email"] as const;
const SENSITIVE_OWN_USER_FIELDS = ["password"] as const;

export type PublicUserLean = LeanDocument<UserDB>;
export type PublicUserRaw = TransformedDocument<PublicUserLean>;
export type PublicUserExtended = Merge<PublicUserRaw, UserExtensionFields>;
export type PublicUserSanitized = Omit<
  PublicUserExtended,
  (typeof SENSITIVE_PUBLIC_USER_FIELDS)[number]
>;

export type PublicUserTransformations = {
  DB: UserDB;
  Lean: LeanDocument<PublicUserTransformations["DB"]>;
  Raw: TransformedDocument<PublicUserTransformations["Lean"]>;
  Extended: Merge<PublicUserTransformations["Raw"], UserExtensionFields>;
  Sanitized: Omit<
    PublicUserTransformations["Extended"],
    (typeof SENSITIVE_PUBLIC_USER_FIELDS)[number]
  >;
  Frontend: PublicUserTransformations["Sanitized"];
};

export type OwnUserTransformations = {
  DB: UserDB;
  Lean: LeanDocument<OwnUserTransformations["DB"]>;
  Raw: TransformedDocument<OwnUserTransformations["Lean"]>;
  Extended: Merge<OwnUserTransformations["Raw"], UserExtensionFields>;
  Sanitized: Omit<
    OwnUserTransformations["Extended"],
    (typeof SENSITIVE_OWN_USER_FIELDS)[number]
  >;
  Frontend: OwnUserTransformations["Sanitized"];
};

export type OwnUserTransformationsPopulated = {
  Lean: WithPopulatedFields<
    OwnUserTransformations["Lean"],
    {
      watchlist: PublicArtworkTransformations["Lean"][];
    }
  >;
  Raw: WithPopulatedFields<
    OwnUserTransformations["Raw"],
    {
      watchlist: PublicArtworkTransformations["Raw"][];
    }
  >;
  Frontend: WithPopulatedFields<
    OwnUserTransformations["Frontend"],
    {
      watchlist: PublicArtworkTransformations["Frontend"][];
    }
  >;
};

//! Frontend-specific types (safe)
export type PublicUser = PublicUserTransformations["Frontend"];
