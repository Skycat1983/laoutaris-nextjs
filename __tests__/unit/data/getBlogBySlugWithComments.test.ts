jest.mock("server-only", () => ({}), { virtual: true });

import { BlogModel } from "@/lib/data/models/blogModel";
import { getBlogBySlugWithComments } from "@/lib/data/services/getBlogBySlugWithComments";
import dbConnect from "@/lib/db/mongodb";
import { transformBlogPopulatedWithCommentsPopulated } from "@/lib/transforms/blog/transformBlog";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/blogModel", () => ({
  BlogModel: {
    findOne: jest.fn(),
  },
}));

jest.mock("@/lib/transforms/blog/transformBlog", () => ({
  transformBlogPopulatedWithCommentsPopulated: jest.fn(),
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockBlogFindOne = BlogModel.findOne as jest.Mock;
const mockTransformBlogPopulatedWithCommentsPopulated =
  transformBlogPopulatedWithCommentsPopulated as jest.MockedFunction<
    typeof transformBlogPopulatedWithCommentsPopulated
  >;

const createBlogDetailQuery = (result: unknown) => {
  const query = {
    populate: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.populate.mockReturnValue(query);
  return query;
};

const createRejectedBlogDetailQuery = (error: unknown) => {
  const query = {
    populate: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.populate.mockReturnValue(query);
  return query;
};

describe("getBlogBySlugWithComments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  it("uses MongoDB ownership, comments author population, lean typing, and transform", async () => {
    const rawBlog = {
      slug: "gallery-news",
      title: "Gallery News",
      comments: [{ text: "A comment" }],
    };
    const frontendBlog = {
      slug: "gallery-news",
      title: "Gallery News",
      comments: [{ text: "A comment", author: { name: "Reader" } }],
    };
    const query = createBlogDetailQuery(rawBlog);
    mockBlogFindOne.mockReturnValue(query);
    mockTransformBlogPopulatedWithCommentsPopulated.mockReturnValue(
      frontendBlog as never
    );

    await expect(getBlogBySlugWithComments("gallery-news")).resolves.toBe(
      frontendBlog
    );

    expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
      mockBlogFindOne.mock.invocationCallOrder[0]
    );
    expect(mockBlogFindOne).toHaveBeenCalledWith({ slug: "gallery-news" });
    expect(query.populate).toHaveBeenCalledWith({
      path: "comments",
      populate: {
        path: "author",
      },
    });
    expect(
      mockTransformBlogPopulatedWithCommentsPopulated
    ).toHaveBeenCalledWith(rawBlog);
  });

  it("returns null when the populated blog entry does not exist", async () => {
    mockBlogFindOne.mockReturnValue(createBlogDetailQuery(null));

    await expect(getBlogBySlugWithComments("missing-blog")).resolves.toBeNull();

    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(
      mockTransformBlogPopulatedWithCommentsPopulated
    ).not.toHaveBeenCalled();
  });

  it("rejects when populated blog detail persistence fails", async () => {
    const error = new Error("private comment detail");
    mockBlogFindOne.mockReturnValue(createRejectedBlogDetailQuery(error));

    await expect(getBlogBySlugWithComments("gallery-news")).rejects.toThrow(
      error
    );

    expect(
      mockTransformBlogPopulatedWithCommentsPopulated
    ).not.toHaveBeenCalled();
  });
});
