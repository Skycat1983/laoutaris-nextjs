import { FrontendArtworkFull } from "./artworkTypes";

export type FrontendUser =
  | FrontendUserFull
  | FrontendUserWithWatcherlist
  | FrontendUserWithFavourites
  | FrontendUserUnpopulated;

export interface FrontendUserFull {
  _id: string;
  email: string;
  //! removed to enforce security
  // password: string;
  username: string;
  role: "user" | "admin";
  watchlist: FrontendArtworkFull[];
  favourites: FrontendArtworkFull[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FrontendUserWithWatcherlist {
  _id: string;
  email: string;
  //! removed to enforce security
  // password: string;
  username: string;
  role: "user" | "admin";
  watchlist: FrontendArtworkFull[];
  favourites: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FrontendUserWithFavourites {
  _id: string;
  email: string;
  //! removed to enforce security
  // password: string;
  username: string;
  role: "user" | "admin";
  watchlist: string[];
  favourites: FrontendArtworkFull[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FrontendUserUnpopulated {
  _id: string;
  email: string;
  //! removed to enforce security
  // password: string;
  username: string;
  role: "user" | "admin";
  watchlist: string[];
  favourites: string[];
  createdAt: Date;
  updatedAt: Date;
}
