import { DBUser } from "../models";
import { FrontendArtwork } from "./artworkTypes";
import { FrontendComment } from "./commentTypes";

export type SerializableUser = Omit<
  DBUser,
  "comments" | "watchlist" | "favourites"
> & {
  _id: string;
  comments: string[];
  watchlist: string[];
  favourites: string[];
};

export interface BaseFrontendUser {
  _id: string;
  email: string;
  username: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

// Each field can be either unpopulated or populated
type PopulatedField<T> = string | T;

// Define the user interface with populatable fields
export interface FrontendUser extends BaseFrontendUser {
  comments: PopulatedField<FrontendComment>[];
  watchlist: PopulatedField<FrontendArtwork>[];
  favourites: PopulatedField<FrontendArtwork>[];
}

export interface FrontendUserWithComments extends FrontendUser {
  comments: PopulatedField<FrontendComment>[];
  watchlist: string[];
  favourites: string[];
}

export interface FrontendUserWithWatchlist extends FrontendUser {
  comments: string[];
  watchlist: FrontendArtwork[];
  favourites: string[];
}

export interface FrontendUserWithFavourites extends FrontendUser {
  comments: string[];
  watchlist: string[];
  favourites: FrontendArtwork[];
}

export interface FrontendUserUnpopulated extends BaseFrontendUser {
  comments: string[];
  watchlist: string[];
  favourites: string[];
}
