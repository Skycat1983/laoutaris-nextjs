import { ArticleTransformations } from "./articleTypes";
import { UserTransformations } from "./userTypes";
import { ArtworkTransformations } from "./artworkTypes";
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
