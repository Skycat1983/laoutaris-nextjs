import { UserDB } from "@/lib/data/models";
import {
  CommentFrontend,
  CommentLean,
  ArtworkFrontend,
  ArtworkLean,
  Prettify,
  WithPopulatedFields,
  LeanDocument,
} from "@/lib/data/types";
import { transformOwnUser } from "@/lib/transforms";

export type OwnUserLean = LeanDocument<UserDB>;
export type OwnUserRaw = Prettify<ReturnType<typeof transformOwnUser.toRaw>>;
export type OwnUserExtended = Prettify<
  ReturnType<typeof transformOwnUser.toExtended>
>;
export type OwnUserSanitized = Prettify<
  ReturnType<typeof transformOwnUser.toSanitized>
>;
export type OwnUserFrontend = Prettify<
  ReturnType<typeof transformOwnUser.toFrontend>
>;

export type OwnUserLeanPopulated = Prettify<
  WithPopulatedFields<
    OwnUserLean,
    {
      favourites: ArtworkLean[];
      watchlist: ArtworkLean[];
      comments: CommentLean[];
    }
  >
>;

export type OwnUserFavourites = OwnUserLean["favourites"];

export type OwnUserFrontendPopulated = Prettify<
  WithPopulatedFields<
    OwnUserFrontend,
    {
      favourites: ArtworkFrontend[];
      watchlist: ArtworkFrontend[];
      comments: CommentFrontend[];
    }
  >
>;
