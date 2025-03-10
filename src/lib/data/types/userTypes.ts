import { UserDB } from "../models";
import { LeanDocument, Merge, TransformedDocument } from "./utilTypes";

export type UserExtensionFields = {
  isOnline?: boolean;
};

export type UserLean = LeanDocument<UserDB>;
export type UserRaw = TransformedDocument<UserLean>;
export type UserExtended = Merge<UserRaw, UserExtensionFields>;
export type UserSanitized = Omit<UserExtended, "password" | "email">;

export type UserTransformations = {
  DB: UserDB;
  Lean: LeanDocument<UserTransformations["DB"]>;
  Raw: TransformedDocument<UserTransformations["Lean"]>;
  Extended: Merge<UserTransformations["Raw"], UserExtensionFields>;
  Sanitized: Omit<UserTransformations["Extended"], "password" | "email">;
  Frontend: UserTransformations["Sanitized"];
};

//! Frontend-specific types (safe)
export type User = UserTransformations["Frontend"];
