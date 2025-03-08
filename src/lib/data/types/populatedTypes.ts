import {
  ArticleTransformations,
  UserTransformations,
  ArtworkTransformations,
} from "./transformationTypes";
import { WithPopulated } from "./utilTypes";

export type ArticlePopulatedFrontend = WithPopulated<
  ArticleTransformations,
  "Frontend",
  {
    author: UserTransformations;
    artwork: ArtworkTransformations;
  }
>;

// Other populated types would go here...
