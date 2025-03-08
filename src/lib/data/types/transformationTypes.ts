import { Document as MongoDocument } from "mongoose";
import { ArticleDB, UserDB, ArtworkDB } from "../models";
import { Merge, TransformedDocument } from "./utilTypes";
import { CloudinaryImageSanitized } from "./cloudinaryTypes";

// doc-specific transformation definitions
export type ArticleTransformations = {
  DB: ArticleDB;
  Raw: TransformedDocument<ArticleDB>;
  Extended: Merge<TransformedDocument<ArticleDB>, { readTime?: number }>;
  Sanitized: Omit<
    ArticleTransformations["Extended"],
    "_id" | "createdAt" | "updatedAt"
  >;
  Frontend: ArticleTransformations["Sanitized"];
};

export type UserTransformations = {
  DB: UserDB;
  Raw: TransformedDocument<UserDB>;
  Extended: Merge<TransformedDocument<UserDB>, { isOnline?: boolean }>;
  Sanitized: Omit<UserTransformations["Extended"], "password" | "email">;
  Frontend: UserTransformations["Sanitized"];
};

export type ArtworkTransformations = {
  DB: ArtworkDB;
  Raw: TransformedDocument<ArtworkDB>;
  Extended: Merge<
    TransformedDocument<ArtworkDB>,
    {
      favouriteCount: number;
      watchlistCount: number;
      isFavourited?: boolean;
      isWatchlisted?: boolean;
    }
  >;
  Sanitized: Omit<
    ArtworkTransformations["Extended"],
    "favourited" | "watcherlist" | "image"
  > & {
    image: CloudinaryImageSanitized;
  };
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

export type ArticlePopulatedFrontend = WithPopulated<
  ArticleTransformations,
  "Frontend",
  {
    author: UserTransformations;
    artwork: ArtworkTransformations;
  }
>;
