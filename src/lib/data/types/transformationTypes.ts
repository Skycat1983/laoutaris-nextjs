import { Document as MongoDocument } from "mongoose";
import { ArticleDB, UserDB, ArtworkDB } from "../models";
import { UserLean } from "./userTypes";
import { ArtworkLean } from "./artworkTypes";
import { Merge, MongoDocumentLean } from "./utilTypes";

// doc-specific transformation definitions
export type ArticleTransformations = {
  DB: ArticleDB;
  Lean: MongoDocumentLean<ArticleDB>;
  Extended: Merge<MongoDocumentLean<ArticleDB>, { readTime?: number }>;
  Sanitized: Omit<
    ArticleTransformations["Extended"],
    "_id" | "createdAt" | "updatedAt"
  >;
  Frontend: ArticleTransformations["Sanitized"];
};

export type UserTransformations = {
  DB: UserDB;
  Lean: MongoDocumentLean<UserDB>;
  Extended: Merge<MongoDocumentLean<UserDB>, { isOnline?: boolean }>;
  Sanitized: Omit<UserTransformations["Extended"], "password" | "email">;
  Frontend: UserTransformations["Sanitized"];
};

export type ArtworkTransformations = {
  DB: ArtworkDB;
  Lean: MongoDocumentLean<ArtworkDB>;
  Extended: Merge<
    MongoDocumentLean<ArtworkDB>,
    {
      favouriteCount: number;
      watchlistCount: number;
      isFavourited?: boolean;
      isWatchlisted?: boolean;
    }
  >;
  Sanitized: Omit<
    ArtworkTransformations["Extended"],
    "favourited" | "watcherlist"
  >;
  Frontend: ArtworkTransformations["Sanitized"];
};

// Helper type for populated documents
type WithPopulated<
  T extends { [K in Stage]: any },
  Stage extends keyof T,
  PopulatedKeys extends { [K: string]: { [S in Stage]: any } }
> = Omit<T[Stage], keyof PopulatedKeys> & {
  [K in keyof PopulatedKeys]: PopulatedKeys[K][Stage];
};

export type ArticlePopulatedPublic = WithPopulated<
  ArticleTransformations,
  "Frontend",
  {
    author: UserTransformations;
    artwork: ArtworkTransformations;
  }
>;
