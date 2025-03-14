import { UserDB } from "../models";
import { ArtworkFrontend } from "./artworkTypes";
import { LeanDocument, WithPopulatedFields, Prettify } from "./utilTypes";
import { ArtworkLean } from "./artworkTypes";
import { transformUser } from "@/lib/transforms/user/transformUser";

export type UserLean = LeanDocument<UserDB>;
export type UserRaw = Prettify<ReturnType<typeof transformUser.toRaw>>;
export type UserExtended = Prettify<
  ReturnType<typeof transformUser.toExtended>
>;
export type UserSanitized = Prettify<
  ReturnType<typeof transformUser.toSanitized>
>;
export type UserFrontend = Prettify<
  ReturnType<typeof transformUser.toFrontend>
>;

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
