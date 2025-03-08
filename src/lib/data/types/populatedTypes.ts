import { ArticleTransformations } from "./articleTypes";
import { UserTransformations } from "./userTypes";
import { ArtworkTransformations } from "./artworkTypes";
import { WithPopulated } from "./utilTypes";
import { CollectionTransformations } from "./collectionTypes";
import { WithPopulatedArray } from "./utilTypes";

export type ArticlePopulatedFrontend = WithPopulated<
  ArticleTransformations,
  "Frontend",
  {
    author: UserTransformations;
    artwork: ArtworkTransformations;
  }
>;

export type CollectionPopulatedFrontend = WithPopulatedArray<
  CollectionTransformations,
  "Frontend",
  {
    artworks: ArtworkTransformations[];
  }
>;
