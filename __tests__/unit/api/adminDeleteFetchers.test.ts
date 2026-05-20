import { createDeleteFetchers } from "@/lib/api/admin/delete/fetchers";
import type { Fetcher } from "@/lib/api/core/createFetcher";
import type { AdminDeletePreview } from "@/lib/api/admin/delete/previewTypes";

const preview: AdminDeletePreview = {
  resource: "article",
  target: {
    resource: "article",
    id: "507f1f77bcf86cd799439013",
    label: "Archive Article",
  },
  blocked: false,
  blockingConditions: [],
  wouldDelete: [],
  wouldDetachOrUpdate: [],
  preserved: [],
  productionEvidenceReminders: [],
};

describe("admin delete fetchers", () => {
  it("builds client-safe preview URLs for every delete resource", async () => {
    const result = {
      success: true,
      data: preview,
    };
    const fetcher = jest.fn(async () => result);
    const deleteFetchers = createDeleteFetchers(fetcher as Fetcher);

    await deleteFetchers.preview.article("article id");
    await deleteFetchers.preview.artwork("artwork id");
    await deleteFetchers.preview.blog("blog id");
    await deleteFetchers.preview.collection("collection id");
    await deleteFetchers.preview.comment("comment id");
    await deleteFetchers.preview.user("user id");

    expect(fetcher).toHaveBeenNthCalledWith(
      1,
      "/api/v2/admin/article/delete/article%20id/preview"
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      2,
      "/api/v2/admin/artwork/delete/artwork%20id/preview"
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      3,
      "/api/v2/admin/blog/delete/blog%20id/preview"
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      4,
      "/api/v2/admin/collection/delete/collection%20id/preview"
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      5,
      "/api/v2/admin/comment/delete/comment%20id/preview"
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      6,
      "/api/v2/admin/user/delete/user%20id/preview"
    );
  });

  it("returns route error envelopes from preview requests", async () => {
    const result = {
      success: false,
      error: "Failed to preview user deletion",
    };
    const fetcher = jest.fn(async () => result);
    const deleteFetchers = createDeleteFetchers(fetcher as Fetcher);

    await expect(deleteFetchers.preview.user("missing-user")).resolves.toEqual(
      result
    );
    expect(fetcher).toHaveBeenCalledWith(
      "/api/v2/admin/user/delete/missing-user/preview"
    );
  });

  it("preserves destructive delete requests as DELETE calls", async () => {
    const result = {
      success: true,
      data: null,
    };
    const fetcher = jest.fn(async () => result);
    const deleteFetchers = createDeleteFetchers(fetcher as Fetcher);

    await expect(deleteFetchers.article("article id")).resolves.toBe(result);

    expect(fetcher).toHaveBeenCalledWith(
      "/api/v2/admin/article/delete/article%20id",
      {
        method: "DELETE",
      }
    );
  });
});
