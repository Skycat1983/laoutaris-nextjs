import { UserDB } from "../models";
import { LeanDocument, Merge, TransformedDocument } from "./utilTypes";

export type UserExtensionFields = {
  isOnline?: boolean;
};

export type UserLean = LeanDocument<UserDB>;
export type UserRaw = TransformedDocument<UserLean>;
export type UserExtended = Merge<UserRaw, UserExtensionFields>;
export type UserSanitized = Omit<UserExtended, "password" | "email">;

export type PublicUserTransformations = {
  DB: UserDB;
  Lean: LeanDocument<PublicUserTransformations["DB"]>;
  Raw: TransformedDocument<PublicUserTransformations["Lean"]>;
  Extended: Merge<PublicUserTransformations["Raw"], UserExtensionFields>;
  Sanitized: Omit<PublicUserTransformations["Extended"], "password" | "email">;
  Frontend: PublicUserTransformations["Sanitized"];
};

//! Frontend-specific types (safe)
export type PublicUser = PublicUserTransformations["Frontend"];
