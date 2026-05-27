import { createReadFetchers } from "@/lib/api/admin/read/fetchers";
import {
  ADMIN_READ_RESOURCES,
  adminReadDetailPath,
  adminReadListPath,
} from "@/lib/api/admin/read/paths";
import type { Fetcher } from "@/lib/api/core/createFetcher";

describe("admin read fetchers", () => {
  it("builds explicit list and detail paths for supported resources", () => {
    expect(ADMIN_READ_RESOURCES).toEqual([
      "article",
      "artwork",
      "blog",
      "collection",
      "comment",
      "user",
    ]);
    expect(adminReadDetailPath("article", "id with/slash?and#hash")).toBe(
      "/api/v2/admin/article/read/id%20with%2Fslash%3Fand%23hash"
    );
    expect(
      adminReadListPath("artwork", {
        page: 2,
        limit: 50,
        search: "  blue figure  ",
        filter: {
          key: "medium",
          value: "oil",
        },
      })
    ).toBe(
      "/api/v2/admin/artwork/read?page=2&limit=50&search=blue+figure&filterKey=medium&filterValue=oil"
    );
  });

  it("builds client-safe detail URLs for every read resource", async () => {
    const result = {
      success: true,
      data: {},
    };
    const fetcher = jest.fn(async () => result);
    const readFetchers = createReadFetchers(fetcher as Fetcher);

    await readFetchers.article("article id");
    await readFetchers.artwork("artwork id");
    await readFetchers.blog("blog id");
    await readFetchers.collection("collection id");
    await readFetchers.comment("comment id");
    await readFetchers.user("user id");

    expect(fetcher).toHaveBeenNthCalledWith(
      1,
      "/api/v2/admin/article/read/article%20id"
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      2,
      "/api/v2/admin/artwork/read/artwork%20id"
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      3,
      "/api/v2/admin/blog/read/blog%20id"
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      4,
      "/api/v2/admin/collection/read/collection%20id"
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      5,
      "/api/v2/admin/comment/read/comment%20id"
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      6,
      "/api/v2/admin/user/read/user%20id"
    );
  });

  it("sends trimmed artwork search while preserving route-backed filter params", async () => {
    const fetcher = jest.fn().mockResolvedValue({
      success: true,
      data: [],
      metadata: {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
      },
    }) as jest.MockedFunction<Fetcher>;
    const readFetchers = createReadFetchers(fetcher);

    await readFetchers.artworks({
      page: 2,
      limit: 50,
      search: "  blue figure  ",
      filter: {
        key: "medium",
        value: "oil",
      },
    });

    expect(fetcher).toHaveBeenCalledWith(
      "/api/v2/admin/artwork/read?page=2&limit=50&search=blue+figure&filterKey=medium&filterValue=oil"
    );
  });

  it("sends trimmed article search as a route-backed query param", async () => {
    const fetcher = jest.fn().mockResolvedValue({
      success: true,
      data: [],
      metadata: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    }) as jest.MockedFunction<Fetcher>;
    const readFetchers = createReadFetchers(fetcher);

    await readFetchers.articles({
      page: 2,
      limit: 10,
      search: "  biography notes  ",
    });

    expect(fetcher).toHaveBeenCalledWith(
      "/api/v2/admin/article/read?page=2&limit=10&search=biography+notes"
    );
  });

  it("sends trimmed blog search as a route-backed query param", async () => {
    const fetcher = jest.fn().mockResolvedValue({
      success: true,
      data: [],
      metadata: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    }) as jest.MockedFunction<Fetcher>;
    const readFetchers = createReadFetchers(fetcher);

    await readFetchers.blogs({
      page: 2,
      limit: 10,
      search: "  studio notes  ",
    });

    expect(fetcher).toHaveBeenCalledWith(
      "/api/v2/admin/blog/read?page=2&limit=10&search=studio+notes"
    );
  });

  it("sends trimmed collection search as a route-backed query param", async () => {
    const fetcher = jest.fn().mockResolvedValue({
      success: true,
      data: [],
      metadata: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    }) as jest.MockedFunction<Fetcher>;
    const readFetchers = createReadFetchers(fetcher);

    await readFetchers.collections({
      page: 3,
      limit: 10,
      search: "  archive set  ",
    });

    expect(fetcher).toHaveBeenCalledWith(
      "/api/v2/admin/collection/read?page=3&limit=10&search=archive+set"
    );
  });

  it("sends article read filters as route-backed query params", async () => {
    const fetcher = jest.fn().mockResolvedValue({
      success: true,
      data: [],
      metadata: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    }) as jest.MockedFunction<Fetcher>;
    const readFetchers = createReadFetchers(fetcher);

    await readFetchers.articles({
      page: 1,
      limit: 10,
      filter: {
        key: "overlayColour",
        value: "black",
      },
    });

    expect(fetcher).toHaveBeenCalledWith(
      "/api/v2/admin/article/read?page=1&limit=10&filterKey=overlayColour&filterValue=black"
    );
  });

  it("sends blog read filters as route-backed query params", async () => {
    const fetcher = jest.fn().mockResolvedValue({
      success: true,
      data: [],
      metadata: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    }) as jest.MockedFunction<Fetcher>;
    const readFetchers = createReadFetchers(fetcher);

    await readFetchers.blogs({
      page: 1,
      limit: 10,
      filter: {
        key: "year",
        value: "2025",
      },
    });

    expect(fetcher).toHaveBeenCalledWith(
      "/api/v2/admin/blog/read?page=1&limit=10&filterKey=year&filterValue=2025"
    );
  });
});
