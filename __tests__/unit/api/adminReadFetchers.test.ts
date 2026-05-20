import { createReadFetchers } from "@/lib/api/admin/read/fetchers";
import type { Fetcher } from "@/lib/api/core/createFetcher";

describe("admin read fetchers", () => {
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
