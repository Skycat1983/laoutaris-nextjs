import { createPostFetchers } from "@/lib/api/admin/create/fetchers";
import {
  ADMIN_CREATE_RESOURCES,
  adminCreatePath,
} from "@/lib/api/admin/create/paths";
import type { Fetcher } from "@/lib/api/core/createFetcher";
import type {
  CreateArticleFormValues,
  CreateArtworkFormValues,
  CreateBlogFormValues,
} from "@/lib/data/schemas";
import type { CreateCollectionFormValues } from "@/lib/data/schemas/collectionSchema";

describe("admin create fetchers", () => {
  it("builds explicit create paths for supported resources", () => {
    expect(ADMIN_CREATE_RESOURCES).toEqual([
      "article",
      "artwork",
      "blog",
      "collection",
    ]);
    expect(adminCreatePath("article")).toBe("/api/v2/admin/article/create");
    expect(adminCreatePath("artwork")).toBe("/api/v2/admin/artwork/create");
    expect(adminCreatePath("blog")).toBe("/api/v2/admin/blog/create");
    expect(adminCreatePath("collection")).toBe(
      "/api/v2/admin/collection/create"
    );
  });

  it("sends POST requests for every create resource", async () => {
    const result = {
      success: true,
      data: {},
    };
    const fetcher = jest.fn(async () => result);
    const postFetchers = createPostFetchers(fetcher as Fetcher);

    const articleData = { title: "Article" } as CreateArticleFormValues;
    const collectionData = {
      title: "Collection",
    } as CreateCollectionFormValues;
    const artworkData = { title: "Artwork" } as CreateArtworkFormValues;
    const blogData = { title: "Blog" } as CreateBlogFormValues;

    await postFetchers.article(articleData);
    await postFetchers.collection(collectionData);
    await postFetchers.artwork(artworkData);
    await postFetchers.blog(blogData);

    expect(fetcher).toHaveBeenNthCalledWith(
      1,
      "/api/v2/admin/article/create",
      {
        method: "POST",
        body: JSON.stringify(articleData),
      }
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      2,
      "/api/v2/admin/collection/create",
      {
        method: "POST",
        body: JSON.stringify(collectionData),
      }
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      3,
      "/api/v2/admin/artwork/create",
      {
        method: "POST",
        body: JSON.stringify(artworkData),
      }
    );
    expect(fetcher).toHaveBeenNthCalledWith(4, "/api/v2/admin/blog/create", {
      method: "POST",
      body: JSON.stringify(blogData),
    });
  });
});
