import { ArticleTransformations } from "./articleTypes";
import { UserTransformations } from "./userTypes";
import { ArtworkTransformations } from "./artworkTypes";
import { WithPopulated, WithPopulatedArray, Merge } from "./utilTypes";
import { CollectionTransformations } from "./collectionTypes";
import { BlogEntryTransformations } from "./blogTypes";
import { CommentTransformations } from "./commentTypes";

// First handle the single author population
type BlogEntryWithAuthor = WithPopulated<
  BlogEntryTransformations,
  "Frontend",
  {
    author: UserTransformations;
  }
>;

// Then handle the comments array population
type BlogEntryWithComments = WithPopulatedArray<
  BlogEntryTransformations,
  "Frontend",
  {
    comments: CommentTransformations[];
  }
>;

// Use our Merge utility instead of manual Omit & intersection
export type BlogEntryPopulatedFrontend = Merge<
  BlogEntryWithAuthor,
  BlogEntryWithComments
>;

type ArticleWithAuthor = WithPopulated<
  ArticleTransformations,
  "Frontend",
  {
    author: UserTransformations;
  }
>;

type ArticleWithArtwork = WithPopulated<
  ArticleTransformations,
  "Frontend",
  {
    artwork: ArtworkTransformations;
  }
>;

// Merge both populated types, omitting overlapping fields
export type ArticlePopulatedFrontend = Merge<
  ArticleWithAuthor,
  ArticleWithArtwork
>;

export type CollectionPopulatedFrontend = WithPopulatedArray<
  CollectionTransformations,
  "Frontend",
  {
    artworks: ArtworkTransformations[];
  }
>;

// export type ArticlePopulatedFrontend = WithPopulated<
//   ArticleTransformations,
//   "Frontend",
//   {
//     author: UserTransformations;
//     artwork: ArtworkTransformations;
//   }
// >;
