jest.mock("server-only", () => ({}), { virtual: true });

import { ArticleModel } from "@/lib/data/models/articleModel";
import { getArticleList } from "@/lib/data/services/getArticleList";
import dbConnect from "@/lib/db/mongodb";
import { transformArticle } from "@/lib/transforms/article/transformArticle";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/articleModel", () => ({
  ArticleModel: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

jest.mock("@/lib/transforms/article/transformArticle", () => ({
  transformArticle: {
    toFrontend: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockArticleFind = ArticleModel.find as jest.Mock;
const mockArticleCountDocuments = ArticleModel.countDocuments as jest.Mock;
const mockTransformArticleToFrontend = transformArticle.toFrontend as jest.Mock;

const createArticleListQuery = (result: unknown) => {
  const query = {
    select: jest.fn(),
    skip: jest.fn(),
    limit: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.select.mockReturnValue(query);
  query.skip.mockReturnValue(query);
  query.limit.mockReturnValue(query);
  return query;
};

const createRejectedArticleListQuery = (error: unknown) => {
  const query = {
    select: jest.fn(),
    skip: jest.fn(),
    limit: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.select.mockReturnValue(query);
  query.skip.mockReturnValue(query);
  query.limit.mockReturnValue(query);
  return query;
};

describe("getArticleList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    mockArticleCountDocuments.mockResolvedValue(12);
    mockTransformArticleToFrontend.mockImplementation((article) => ({
      slug: article.slug,
      title: article.title,
      linkTo: `/biography/${article.slug}`,
    }));
  });

  it("uses MongoDB ownership, section filtering, selected fields, pagination, transforms, and metadata", async () => {
    const rawArticles = [
      { slug: "early-life", title: "Early Life" },
      { slug: "studio-years", title: "Studio Years" },
    ];
    const query = createArticleListQuery(rawArticles);
    mockArticleFind.mockReturnValue(query);

    await expect(
      getArticleList({
        section: "biography",
        fields: "title subtitle slug imageUrl",
        page: 2,
        limit: 5,
      })
    ).resolves.toEqual({
      success: true,
      data: [
        {
          slug: "early-life",
          title: "Early Life",
          linkTo: "/biography/early-life",
        },
        {
          slug: "studio-years",
          title: "Studio Years",
          linkTo: "/biography/studio-years",
        },
      ],
      metadata: {
        page: 2,
        limit: 5,
        total: 12,
        totalPages: 3,
      },
    });

    expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
      mockArticleFind.mock.invocationCallOrder[0]
    );
    expect(mockArticleFind).toHaveBeenCalledWith({ section: "biography" });
    expect(mockArticleCountDocuments).toHaveBeenCalledWith({
      section: "biography",
    });
    expect(query.select).toHaveBeenCalledWith("title subtitle slug imageUrl");
    expect(query.skip).toHaveBeenCalledWith(5);
    expect(query.limit).toHaveBeenCalledWith(5);
    expect(mockTransformArticleToFrontend).toHaveBeenNthCalledWith(
      1,
      rawArticles[0],
      null
    );
    expect(mockTransformArticleToFrontend).toHaveBeenNthCalledWith(
      2,
      rawArticles[1],
      null
    );
  });

  it("preserves default list params when filters are omitted", async () => {
    const rawArticles = [{ slug: "default", title: "Default" }];
    const query = createArticleListQuery(rawArticles);
    mockArticleFind.mockReturnValue(query);
    mockArticleCountDocuments.mockResolvedValue(1);

    await expect(getArticleList()).resolves.toEqual({
      success: true,
      data: [
        {
          slug: "default",
          title: "Default",
          linkTo: "/biography/default",
        },
      ],
      metadata: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    });

    expect(mockArticleFind).toHaveBeenCalledWith({});
    expect(mockArticleCountDocuments).toHaveBeenCalledWith({});
    expect(query.select).toHaveBeenCalledWith("");
    expect(query.skip).toHaveBeenCalledWith(0);
    expect(query.limit).toHaveBeenCalledWith(10);
  });

  it("returns null when no articles exist", async () => {
    mockArticleFind.mockReturnValue(createArticleListQuery([]));
    mockArticleCountDocuments.mockResolvedValue(0);

    await expect(getArticleList({ section: "biography" })).resolves.toBeNull();

    expect(mockTransformArticleToFrontend).not.toHaveBeenCalled();
  });

  it("rejects when article list persistence fails", async () => {
    const error = new Error("private article list");
    mockArticleFind.mockReturnValue(createRejectedArticleListQuery(error));

    await expect(getArticleList()).rejects.toThrow(error);

    expect(mockTransformArticleToFrontend).not.toHaveBeenCalled();
  });
});
