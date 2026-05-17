import { createArtworkFetchers } from "@/lib/api/public/artwork/fetchers";
import type { Fetcher } from "@/lib/api/core/createFetcher";

const listResult = {
  success: true,
  data: [],
  metadata: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

describe("public artwork fetchers", () => {
  it("builds the default artwork list URL", async () => {
    const fetcher = jest.fn(async () => listResult);
    const artworkFetchers = createArtworkFetchers(fetcher as Fetcher);

    await artworkFetchers.multiple();

    expect(fetcher).toHaveBeenCalledWith(
      "/api/v2/public/artwork?filterMode=ALL&limit=10&page=1"
    );
  });

  it("preserves repeated filters, sorting, color sorting, and pagination params", async () => {
    const fetcher = jest.fn(async () => listResult);
    const artworkFetchers = createArtworkFetchers(fetcher as Fetcher);

    await artworkFetchers.multiple({
      limit: 50,
      page: 2,
      filterMode: "ANY",
      sortBy: "colorProximity",
      sortColor: "#111111",
      decade: ["1970s", "1980s"],
      artstyle: ["abstract"],
      medium: ["oil", "acrylic"],
      surface: ["canvas"],
    });

    expect(fetcher).toHaveBeenCalledWith(
      "/api/v2/public/artwork?sortBy=colorProximity&sortColor=%23111111&filterMode=ANY&decade=1970s&decade=1980s&artstyle=abstract&medium=oil&medium=acrylic&surface=canvas&limit=50&page=2"
    );
  });

  it("omits sortColor unless the sort is color proximity", async () => {
    const fetcher = jest.fn(async () => listResult);
    const artworkFetchers = createArtworkFetchers(fetcher as Fetcher);

    await artworkFetchers.multiple({
      limit: 10,
      page: 1,
      filterMode: "ALL",
      sortBy: "mostRecent",
      sortColor: "#111111",
    });

    expect(fetcher).toHaveBeenCalledWith(
      "/api/v2/public/artwork?sortBy=mostRecent&filterMode=ALL&limit=10&page=1"
    );
  });
});
