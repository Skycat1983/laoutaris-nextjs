import { createDeleteFetchers } from "@/lib/api/admin/delete/fetchers";
import type { Fetcher } from "@/lib/api/core/createFetcher";
import type { AdminDeletePreview } from "@/lib/api/admin/delete/previewTypes";
import type { AdminDeleteEvidence } from "@/lib/api/admin/delete/evidenceTypes";
import {
  ADMIN_DELETE_RESOURCES,
  adminDeletePath,
  adminDeletePreviewPath,
} from "@/lib/api/admin/delete/paths";

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

const evidence: AdminDeleteEvidence = {
  backupExportConfirmed: true,
  backupExportReference: "mongodump archive 2026-05-20",
  ownerReviewConfirmed: true,
  ownerReviewReference: "owner review T-164",
};

describe("admin delete fetchers", () => {
  it("builds explicit destructive and preview paths for supported resources", () => {
    expect(ADMIN_DELETE_RESOURCES).toEqual([
      "article",
      "artwork",
      "blog",
      "collection",
      "comment",
      "user",
    ]);
    expect(adminDeletePath("article", "id with/slash?and#hash")).toBe(
      "/api/v2/admin/article/delete/id%20with%2Fslash%3Fand%23hash"
    );
    expect(adminDeletePreviewPath("user", "user id")).toBe(
      "/api/v2/admin/user/delete/user%20id/preview"
    );
  });

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

  it("sends evidence with destructive delete requests for every resource", async () => {
    const result = {
      success: true,
      data: null,
    };
    const fetcher = jest.fn(async () => result);
    const deleteFetchers = createDeleteFetchers(fetcher as Fetcher);

    await deleteFetchers.article("article id", evidence);
    await deleteFetchers.artwork("artwork id", evidence);
    await deleteFetchers.blog("blog id", evidence);
    await deleteFetchers.collection("collection id", evidence);
    await deleteFetchers.comment("comment id", evidence);
    await deleteFetchers.user("user id", evidence);

    expect(fetcher).toHaveBeenNthCalledWith(
      1,
      "/api/v2/admin/article/delete/article%20id",
      {
        method: "DELETE",
        body: JSON.stringify(evidence),
      }
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      2,
      "/api/v2/admin/artwork/delete/artwork%20id",
      {
        method: "DELETE",
        body: JSON.stringify(evidence),
      }
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      3,
      "/api/v2/admin/blog/delete/blog%20id",
      {
        method: "DELETE",
        body: JSON.stringify(evidence),
      }
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      4,
      "/api/v2/admin/collection/delete/collection%20id",
      {
        method: "DELETE",
        body: JSON.stringify(evidence),
      }
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      5,
      "/api/v2/admin/comment/delete/comment%20id",
      {
        method: "DELETE",
        body: JSON.stringify(evidence),
      }
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      6,
      "/api/v2/admin/user/delete/user%20id",
      {
        method: "DELETE",
        body: JSON.stringify(evidence),
      }
    );
  });
});
