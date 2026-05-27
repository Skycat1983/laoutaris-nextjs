import { createUpdateFetchers } from "@/lib/api/admin/update/fetchers";
import {
  ADMIN_UPDATE_RESOURCES,
  adminUpdatePath,
} from "@/lib/api/admin/update/paths";
import type { Fetcher } from "@/lib/api/core/createFetcher";
import type {
  UpdateArticleFormValues,
  UpdateArtworkFormValues,
  UpdateBlogFormValues,
} from "@/lib/data/schemas";
import type { UpdateCollectionFormValues } from "@/lib/data/schemas/collectionSchema";

describe("admin update fetchers", () => {
  it("builds explicit update paths for supported resources", () => {
    expect(ADMIN_UPDATE_RESOURCES).toEqual([
      "article",
      "artwork",
      "blog",
      "collection",
    ]);
    expect(adminUpdatePath("article", "id with/slash?and#hash")).toBe(
      "/api/v2/admin/article/update/id%20with%2Fslash%3Fand%23hash"
    );
  });

  it("sends PATCH requests for every update resource with encoded IDs", async () => {
    const result = {
      success: true,
      data: {},
    };
    const fetcher = jest.fn(async () => result);
    const updateFetchers = createUpdateFetchers(fetcher as Fetcher);

    const articleData = { title: "Article" } as UpdateArticleFormValues;
    const collectionData = {
      title: "Collection",
    } as UpdateCollectionFormValues;
    const artworkData = { title: "Artwork" } as UpdateArtworkFormValues;
    const blogData = { title: "Blog" } as UpdateBlogFormValues;

    await updateFetchers.patchArticle("article id", articleData);
    await updateFetchers.patchCollection("collection id", collectionData);
    await updateFetchers.patchArtwork("artwork id", artworkData);
    await updateFetchers.patchBlog("blog id", blogData);

    expect(fetcher).toHaveBeenNthCalledWith(
      1,
      "/api/v2/admin/article/update/article%20id",
      {
        method: "PATCH",
        body: JSON.stringify(articleData),
      }
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      2,
      "/api/v2/admin/collection/update/collection%20id",
      {
        method: "PATCH",
        body: JSON.stringify(collectionData),
      }
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      3,
      "/api/v2/admin/artwork/update/artwork%20id",
      {
        method: "PATCH",
        body: JSON.stringify(artworkData),
      }
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      4,
      "/api/v2/admin/blog/update/blog%20id",
      {
        method: "PATCH",
        body: JSON.stringify(blogData),
      }
    );
  });
});
