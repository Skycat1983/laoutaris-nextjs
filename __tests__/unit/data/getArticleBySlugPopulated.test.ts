jest.mock("server-only", () => ({}), { virtual: true });

import { ArticleModel } from "@/lib/data/models/articleModel";
import { getArticleBySlugPopulated } from "@/lib/data/services/getArticleBySlugPopulated";
import dbConnect from "@/lib/db/mongodb";
import { transformArticlePopulated } from "@/lib/transforms/article/transformArticle";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/articleModel", () => ({
  ArticleModel: {
    findOne: jest.fn(),
  },
}));

jest.mock("@/lib/data/models/artworkModel", () => ({
  ArtworkModel: { modelName: "Artwork" },
}));

jest.mock("@/lib/data/models/userModel", () => ({
  UserModel: { modelName: "User" },
}));

jest.mock("@/lib/transforms/article/transformArticle", () => ({
  transformArticlePopulated: jest.fn(),
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockArticleFindOne = ArticleModel.findOne as jest.Mock;
const mockTransformArticlePopulated =
  transformArticlePopulated as jest.MockedFunction<
    typeof transformArticlePopulated
  >;

const createPopulatedArticleQuery = (result: unknown) => {
  const query = {
    populate: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.populate.mockReturnValue(query);
  return query;
};

const createRejectedPopulatedArticleQuery = (error: unknown) => {
  const query = {
    populate: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.populate.mockReturnValue(query);
  return query;
};

describe("getArticleBySlugPopulated", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  it("uses MongoDB ownership, populated lookup, lean typing, and transform", async () => {
    const rawArticle = { slug: "studio-notes", title: "Studio Notes" };
    const frontendArticle = {
      slug: "studio-notes",
      title: "Studio Notes",
      linkTo: "/article/studio-notes",
    };
    const query = createPopulatedArticleQuery(rawArticle);
    mockArticleFindOne.mockReturnValue(query);
    mockTransformArticlePopulated.mockReturnValue(frontendArticle as never);

    await expect(getArticleBySlugPopulated("studio-notes")).resolves.toBe(
      frontendArticle
    );

    expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
      mockArticleFindOne.mock.invocationCallOrder[0]
    );
    expect(mockArticleFindOne).toHaveBeenCalledWith({
      slug: "studio-notes",
    });
    expect(query.populate).toHaveBeenCalledWith({
      path: "author",
      model: { modelName: "User" },
    });
    expect(query.populate).toHaveBeenCalledWith({
      path: "artwork",
      model: { modelName: "Artwork" },
    });
    expect(mockTransformArticlePopulated).toHaveBeenCalledWith(rawArticle);
  });

  it("returns null when the article does not exist", async () => {
    mockArticleFindOne.mockReturnValue(createPopulatedArticleQuery(null));

    await expect(getArticleBySlugPopulated("missing-article")).resolves.toBeNull();

    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockTransformArticlePopulated).not.toHaveBeenCalled();
  });

  it("rejects when article detail persistence fails", async () => {
    const error = new Error("private article detail");
    mockArticleFindOne.mockReturnValue(createRejectedPopulatedArticleQuery(error));

    await expect(getArticleBySlugPopulated("studio-notes")).rejects.toThrow(
      error
    );

    expect(mockTransformArticlePopulated).not.toHaveBeenCalled();
  });
});
