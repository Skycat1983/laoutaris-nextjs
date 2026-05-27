import type { Fetcher } from "../../core/createFetcher";
import type {
  UpdateArticleFormValues,
  UpdateArtworkFormValues,
  UpdateBlogFormValues,
} from "@/lib/data/schemas";
import type { UpdateCollectionFormValues } from "@/lib/data/schemas/collectionSchema";
import type { AdminArticle, AdminCollection, AdminArtwork, AdminBlog } from "@/lib/data/types/adminTypes";
import type { SingleResult } from "@/lib/data/types/apiTypes";
import { adminUpdatePath } from "./paths";

export type UpdateArticleResult = SingleResult<AdminArticle>;
export type UpdateCollectionResult = SingleResult<AdminCollection>;
export type UpdateArtworkResult = SingleResult<AdminArtwork>;
export type UpdateBlogResult = SingleResult<AdminBlog>;

export const createUpdateFetchers = (fetcher: Fetcher) => ({
  // Patch article
  patchArticle: async (articleId: string, data: UpdateArticleFormValues) => {
    return fetcher<UpdateArticleResult>(
      adminUpdatePath("article", articleId),
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  // Patch collection
  patchCollection: async (
    collectionId: string,
    data: UpdateCollectionFormValues
  ) => {
    return fetcher<UpdateCollectionResult>(
      adminUpdatePath("collection", collectionId),
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  // Patch artwork
  patchArtwork: async (artworkId: string, data: UpdateArtworkFormValues) => {
    return fetcher<UpdateArtworkResult>(
      adminUpdatePath("artwork", artworkId),
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  // Patch blog
  patchBlog: async (blogId: string, data: UpdateBlogFormValues) => {
    return fetcher<UpdateBlogResult>(adminUpdatePath("blog", blogId), {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
});

export type UpdateFetchers = ReturnType<typeof createUpdateFetchers>;
