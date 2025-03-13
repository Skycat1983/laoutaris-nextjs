import { ArtworkFrontend, ArtworkLean } from "./artworkTypes";
import { UserFrontend, UserLean } from "./userTypes";
import { LeanDocument, Prettify, WithPopulatedFields } from "./utilTypes";
import { transformArticle } from "@/lib/transforms/transformArticle";
import { ArticleDB } from "@/lib/data/models";

export type ArticleLean = LeanDocument<ArticleDB>;
export type ArticleFrontend = ReturnType<typeof transformArticle.toFrontend>;

export type ArticleLeanPopulated = Prettify<
  WithPopulatedFields<
    ArticleLean,
    {
      author: UserLean;
      artwork: ArtworkLean;
    }
  >
>;

export type ArticleFrontendPopulated = Prettify<
  WithPopulatedFields<
    ArticleFrontend,
    {
      author: UserFrontend;
      artwork: ArtworkFrontend;
    }
  >
>;

export interface ArticleFilterParams {
  key: "section" | null;
  value: string | null;
}
