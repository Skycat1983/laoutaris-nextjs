import { IFrontendArtwork } from "./artworkTypes";

export interface ISignupData {
  email: string;
  password: string;
  username: string;
}

export interface IFrontendUser {
  email: string;
  password: string;
  username: string;
  role: "user" | "admin";
  watchlist: string[] | IFrontendArtwork[];
  favourites: string[] | IFrontendArtwork[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User with populated watchlist
 */
export interface IFrontendUserPopulatedWatchlist extends IFrontendUser {
  watchlist: IFrontendArtwork[];
  // favourites remain as strings
}

/**
 * User with populated favourites
 */
export interface IFrontendUserPopulatedFavourites extends IFrontendUser {
  // watchlist remains as strings
  favourites: IFrontendArtwork[];
}

/**
 * User with both watchlist and favourites populated
 */
export interface IFrontendUserPopulatedWatchlistAndFavourites
  extends IFrontendUser {
  watchlist: IFrontendArtwork[];
  favourites: IFrontendArtwork[];
}

export interface IFrontendUserBase {
  email: string;
  password: string;
  username: string;
  role: "user" | "admin";
  watchlist: string[];
  favourites: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Union type representing all possible user states
 */
export type IFrontendUserType =
  | IFrontendUser
  | IFrontendUserPopulatedWatchlist
  | IFrontendUserPopulatedFavourites
  | IFrontendUserPopulatedWatchlistAndFavourites;
