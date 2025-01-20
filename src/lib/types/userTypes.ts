import { FrontendArtworkFull } from "./artworkTypes";

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

//! OLD TYPES BELOW:
//* TRYING WITH FULL USER TYPE

// export interface IFrontendUser {
//   email: string;
//   password: string;
//   username: string;
//   role: "user" | "admin";
//   watchlist: string[] | IFrontendArtwork[];
//   favourites: string[] | IFrontendArtwork[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface IFrontendUserPopulatedWatchlist extends IFrontendUser {
//   watchlist: IFrontendArtwork[];
// }

// export interface IFrontendUserPopulatedFavourites extends IFrontendUser {
//   favourites: IFrontendArtwork[];
// }

// export interface IFrontendUserPopulatedWatchlistAndFavourites
//   extends IFrontendUser {
//   watchlist: IFrontendArtwork[];
//   favourites: IFrontendArtwork[];
// }

// export interface IFrontendUserBase {
//   email: string;
//   password: string;
//   username: string;
//   role: "user" | "admin";
//   watchlist: string[];
//   favourites: string[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export type IFrontendUserType =
//   | IFrontendUser
//   | IFrontendUserPopulatedWatchlist
//   | IFrontendUserPopulatedFavourites
//   | IFrontendUserPopulatedWatchlistAndFavourites;

// export interface ISignupData {
//   email: string;
//   password: string;
//   username: string;
// }
