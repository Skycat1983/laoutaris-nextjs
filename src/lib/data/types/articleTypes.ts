import {
  ExtendedPublicArticleFields,
  SensitivePublicArticleFields,
} from "@/lib/constants";
import { ArticleDB } from "../models";
import { PublicArtworkTransformations } from "./artworkTypes";
import { PublicUserTransformations } from "./userTypes";
import {
  LeanDocument,
  Merge,
  Prettify,
  TransformedDocument,
  WithPopulatedFields,
} from "./utilTypes";

export type PublicArticleTransformations = {
  DB: ArticleDB;
  Lean: LeanDocument<PublicArticleTransformations["DB"]>;
  Raw: TransformedDocument<PublicArticleTransformations["Lean"]>;
  Extended: Merge<
    PublicArticleTransformations["Raw"],
    ExtendedPublicArticleFields
  >;
  Sanitized: Omit<
    PublicArticleTransformations["Extended"],
    SensitivePublicArticleFields[number]
  >;
  Frontend: PublicArticleTransformations["Sanitized"];
};

export type PublicArticleTransformationsPopulated = {
  Lean: WithPopulatedFields<
    PublicArticleTransformations["Lean"],
    {
      author: PublicUserTransformations["Lean"];
      artwork: PublicArtworkTransformations["Lean"];
    }
  >;
  Raw: WithPopulatedFields<
    PublicArticleTransformations["Raw"],
    {
      author: PublicUserTransformations["Raw"];
      artwork: PublicArtworkTransformations["Raw"];
    }
  >;
  Extended: WithPopulatedFields<
    PublicArticleTransformations["Extended"],
    {
      author: PublicUserTransformations["Extended"];
      artwork: PublicArtworkTransformations["Extended"];
    }
  >;
  Frontend: WithPopulatedFields<
    PublicArticleTransformations["Frontend"],
    {
      author: PublicUserTransformations["Frontend"];
      artwork: PublicArtworkTransformations["Frontend"];
    }
  >;
};

export type LeanArticlePopulated =
  PublicArticleTransformationsPopulated["Lean"];
export type FrontendArticlePopulated =
  PublicArticleTransformationsPopulated["Frontend"];

// export type PublicArticleTransformationsPopulated = {
//   Lean: WithPopulatedFields<
//     PublicArticleTransformations["Lean"],
//     {
//       author: PublicUserTransformations["Lean"];
//       artwork: PublicArtworkTransformations["Lean"];
//     }
//   >;
//   Raw: PublicArticleTransformations["Raw"];

//   Extended: WithPopulatedFields<
//     PublicArticleTransformations["Extended"],
//     {
//       author: PublicUserTransformations["Extended"];
//       artwork: PublicArtworkTransformations["Extended"];
//     }
//   >;
//   Frontend: WithPopulatedFields<
//     PublicArticleTransformations["Frontend"],
//     {
//       author: PublicUserTransformations["Frontend"];
//       artwork: PublicArtworkTransformations["Frontend"];
//     }
//   >;
// };

//! Frontend-specific types
export type PublicArticle = PublicArticleTransformations["Frontend"];
export type PublicArticlePopulated =
  PublicArticleTransformationsPopulated["Frontend"];

export interface ArticleFilterParams {
  key: "section" | null;
  value: string | null;
}

//! Article fields
export type Section = "artwork" | "biography" | "project" | "collections";
export type OverlayColour = "white" | "black";

// export type PublicArticleLean = LeanDocument<ArticleDB>;
// export type PublicArticleRaw = TransformedDocument<PublicArticleLean>;
// export type PublicArticleExtended = Merge<
//   PublicArticleRaw,
//   { readTime?: number }
// >;
// export type PublicArticleSanitized = Omit<
//   PublicArticleExtended,
//   "_id" | "createdAt" | "updatedAt"
// >;
