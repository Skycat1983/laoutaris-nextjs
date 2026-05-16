jest.mock("server-only", () => ({}), { virtual: true });

import { ArticleModel } from "@/lib/data/models/articleModel";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";
import dbConnect from "@/lib/db/mongodb";
import { transformBiographyNav } from "@/lib/transforms/navigation/transformNavData";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/articleModel", () => ({
  ArticleModel: {
    find: jest.fn(),
  },
}));

jest.mock("@/lib/transforms/navigation/transformNavData", () => ({
  transformBiographyNav: {
    toFrontend: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockArticleFind = ArticleModel.find as jest.Mock;
const mockTransformBiographyNavToFrontend =
  transformBiographyNav.toFrontend as jest.Mock;

const createArticleListQuery = (result: unknown) => {
  const query = {
    select: jest.fn(),
    sort: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.select.mockReturnValue(query);
  query.sort.mockReturnValue(query);
  return query;
};

const createRejectedArticleListQuery = (error: unknown) => {
  const query = {
    select: jest.fn(),
    sort: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.select.mockReturnValue(query);
  query.sort.mockReturnValue(query);
  return query;
};

describe("getArticleNavigationList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  it("uses MongoDB ownership, selection, ordering, transforms, and metadata", async () => {
    const rawArticles = [
      { slug: "early-life", title: "Early Life" },
      { slug: "studio-years", title: "Studio Years" },
    ];
    const navItems = [
      { slug: "early-life", title: "Early Life", linkTo: "/early-life" },
      { slug: "studio-years", title: "Studio Years", linkTo: "/studio" },
    ];
    const query = createArticleListQuery(rawArticles);
    mockArticleFind.mockReturnValue(query);
    mockTransformBiographyNavToFrontend
      .mockReturnValueOnce(navItems[0])
      .mockReturnValueOnce(navItems[1]);

    await expect(getArticleNavigationList("biography")).resolves.toEqual({
      success: true,
      data: navItems,
      metadata: {
        total: 2,
        page: 1,
        limit: 2,
        totalPages: 1,
      },
    });

    expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
      mockArticleFind.mock.invocationCallOrder[0]
    );
    expect(mockArticleFind).toHaveBeenCalledWith({ section: "biography" });
    expect(query.select).toHaveBeenCalledWith("title slug");
    expect(query.sort).toHaveBeenCalledWith({ displayDate: -1 });
    expect(mockTransformBiographyNavToFrontend).toHaveBeenNthCalledWith(
      1,
      rawArticles[0]
    );
    expect(mockTransformBiographyNavToFrontend).toHaveBeenNthCalledWith(
      2,
      rawArticles[1]
    );
  });

  it("returns null when no article navigation items exist", async () => {
    mockArticleFind.mockReturnValue(createArticleListQuery([]));

    await expect(getArticleNavigationList("project")).resolves.toBeNull();

    expect(mockTransformBiographyNavToFrontend).not.toHaveBeenCalled();
  });

  it("rejects when article navigation persistence fails", async () => {
    const error = new Error("private article nav");
    mockArticleFind.mockReturnValue(createRejectedArticleListQuery(error));

    await expect(getArticleNavigationList("biography")).rejects.toThrow(error);

    expect(mockTransformBiographyNavToFrontend).not.toHaveBeenCalled();
  });
});
