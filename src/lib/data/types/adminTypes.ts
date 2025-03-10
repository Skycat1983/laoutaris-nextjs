// all of the above types but from /types
import {
  TransformedDocument,
  WithPopulated,
  LeanDocument,
} from "@/lib/data/types";
import {
  ArticleDB,
  ArtworkDB,
  BlogEntryDB,
  CollectionDB,
  CommentDB,
  UserDB,
} from "../models";
import { Merge, WithPopulatedArray } from "./utilTypes";

// TODO: something like this
export type AdminTransformations<TDB> = {
  DB: TDB;
  Lean: LeanDocument<TDB>;
  Raw: TransformedDocument<TDB>;
  Frontend: TransformedDocument<TDB>;
};

// ! Admin Transofromation types
export type AdminArticleTransformations = {
  DB: ArticleDB;
  Lean: LeanDocument<AdminArticleTransformations["DB"]>;
  Raw: TransformedDocument<AdminArticleTransformations["Lean"]>;
  Frontend: TransformedDocument<AdminArticleTransformations["Raw"]>;
};

export type AdminArtworkTransformations = {
  DB: ArtworkDB;
  Lean: LeanDocument<AdminArtworkTransformations["DB"]>;
  Raw: TransformedDocument<AdminArtworkTransformations["Lean"]>;
  Frontend: TransformedDocument<AdminArtworkTransformations["Raw"]>;
};

export type AdminCollectionTransformations = {
  DB: CollectionDB;
  Lean: LeanDocument<AdminCollectionTransformations["DB"]>;
  Raw: TransformedDocument<AdminCollectionTransformations["Lean"]>;
  Frontend: TransformedDocument<AdminCollectionTransformations["Raw"]>;
};

export type AdminBlogTransformations = {
  DB: BlogEntryDB;
  Lean: LeanDocument<AdminBlogTransformations["DB"]>;
  Raw: TransformedDocument<AdminBlogTransformations["Lean"]>;
  Frontend: TransformedDocument<AdminBlogTransformations["Raw"]>;
};

export type AdminCommentTransformations = {
  DB: CommentDB;
  Lean: LeanDocument<AdminCommentTransformations["DB"]>;
  Raw: TransformedDocument<AdminCommentTransformations["Lean"]>;
  Frontend: TransformedDocument<AdminCommentTransformations["Raw"]>;
};

export type AdminUserTransformations = {
  DB: UserDB;
  Lean: LeanDocument<AdminUserTransformations["DB"]>;
  Raw: TransformedDocument<AdminUserTransformations["Lean"]>;
  Frontend: TransformedDocument<AdminUserTransformations["Raw"]>;
};

//! admin frontend types unpopulated
export type AdminArticle = AdminArticleTransformations["Frontend"];
export type AdminArtwork = AdminArtworkTransformations["Frontend"];
export type AdminCollection = AdminCollectionTransformations["Frontend"];
export type AdminBlog = AdminBlogTransformations["Frontend"];
export type AdminComment = AdminCommentTransformations["Frontend"];
export type AdminUser = AdminUserTransformations["Frontend"];

//! admin populated types
export type AdminArticlePopulated = WithPopulated<
  AdminArticleTransformations,
  "Frontend",
  {
    author: AdminUserTransformations;
    artwork: AdminArtworkTransformations;
  }
>;

export type AdminCollectionPopulated = WithPopulatedArray<
  AdminCollectionTransformations,
  "Frontend",
  {
    artworks: AdminArtworkTransformations[];
  }
>;

// If you need both single and array populations
export type AdminBlogAuthorPopulated = WithPopulated<
  AdminBlogTransformations,
  "Frontend",
  {
    author: AdminUserTransformations;
  }
>;

export type AdminBlogCommentsPopulated = WithPopulatedArray<
  AdminBlogTransformations,
  "Frontend",
  {
    comments: AdminCommentTransformations[];
  }
>;

export type AdminBlogPopulated = Merge<
  AdminBlogAuthorPopulated,
  AdminBlogCommentsPopulated
>;

export type AdminCommentPopulated = WithPopulated<
  AdminCommentTransformations,
  "Frontend",
  {
    author: AdminUserTransformations;
    blog: AdminBlogTransformations;
  }
>;

// export type AdminBlogPopulated = Merge<BlogWithAuthor, BlogWithComments>;
