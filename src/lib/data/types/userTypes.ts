import {
  ExtendedPublicUserFields,
  SensitivePublicUserFields,
  ExtendedOwnUserFields,
  SensitiveOwnUserFields,
} from "@/lib/constants";
import { UserDB } from "../models";
import { ArtworkFrontend } from "./artworkTypes";
import {
  LeanDocument,
  Merge,
  TransformedDocument,
  WithPopulatedFields,
} from "./utilTypes";
import { ArtworkLean } from "./artworkTypes";
import { transformUser } from "@/lib/transforms/transformUser";

export type UserLean = LeanDocument<UserDB>;
export type UserFrontend = ReturnType<typeof transformUser.toFrontend>;

export type UserLeanPopulated = WithPopulatedFields<
  UserLean,
  {
    watchlist: ArtworkLean[];
    favourites: ArtworkLean[];
  }
>;

export type UserFrontendPopulated = WithPopulatedFields<
  UserFrontend,
  {
    watchlist: ArtworkFrontend[];
    favourites: ArtworkFrontend[];
  }
>;

// export type PublicUserTransformations = {
//   DB: UserDB;
//   Lean: LeanDocument<PublicUserTransformations["DB"]>;
//   Raw: TransformedDocument<PublicUserTransformations["Lean"]>;
//   Extended: Merge<PublicUserTransformations["Raw"], ExtendedPublicUserFields>;
//   Sanitized: Omit<
//     PublicUserTransformations["Extended"],
//     SensitivePublicUserFields
//   >;
//   Frontend: PublicUserTransformations["Sanitized"];
// };

// export type PublicUser = PublicUserTransformations["Frontend"];

// export type OwnUserTransformations = {
//   DB: UserDB;
//   Lean: LeanDocument<OwnUserTransformations["DB"]>;
//   Raw: TransformedDocument<OwnUserTransformations["Lean"]>;
//   Extended: Merge<OwnUserTransformations["Raw"], ExtendedOwnUserFields>;
//   Sanitized: Omit<OwnUserTransformations["Extended"], SensitiveOwnUserFields>;
//   Frontend: OwnUserTransformations["Sanitized"];
// };

// export type OwnUser = OwnUserTransformations["Frontend"];

// export type OwnUserTransformationsPopulated = {
//   Lean: WithPopulatedFields<
//     OwnUserTransformations["Lean"],
//     {
//       watchlist: PublicArtworkTransformations["Lean"][];
//     }
//   >;
//   Raw: WithPopulatedFields<
//     OwnUserTransformations["Raw"],
//     {
//       watchlist: PublicArtworkTransformations["Raw"][];
//     }
//   >;
//   Frontend: WithPopulatedFields<
//     OwnUserTransformations["Frontend"],
//     {
//       watchlist: PublicArtworkTransformations["Frontend"][];
//     }
//   >;
// };

// export type OwnUserPopulated = OwnUserTransformationsPopulated["Frontend"];

//! Frontend-specific types (safe)
// export type PublicUserLean = LeanDocument<UserDB>;
// export type PublicUserRaw = TransformedDocument<PublicUserLean>;
// export type PublicUserExtended = Merge<PublicUserRaw, ExtendedPublicUserFields>;
// export type PublicUserSanitized = Omit<
//   PublicUserExtended,
//   SensitivePublicUserFields
// >;
