jest.mock("server-only", () => ({}), { virtual: true });

import { BlogModel } from "@/lib/data/models/blogModel";
import { getBlogBySlugWithAuthor } from "@/lib/data/services/getBlogBySlugWithAuthor";
import dbConnect from "@/lib/db/mongodb";
import { transformBlogWithAuthor } from "@/lib/transforms/blog/transformBlog";

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
  transformBlogWithAuthor: jest.fn(),
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockBlogFindOne = BlogModel.findOne as jest.Mock;
const mockTransformBlogWithAuthor =
  transformBlogWithAuthor as jest.MockedFunction<typeof transformBlogWithAuthor>;

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

describe("getBlogBySlugWithAuthor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  it("uses MongoDB ownership, author detail population, lean typing, and transform", async () => {
    const rawBlog = { slug: "gallery-news", title: "Gallery News" };
    const frontendBlog = {
      slug: "gallery-news",
      title: "Gallery News",
      linkTo: "/blog/gallery-news",
    };
    const query = createBlogDetailQuery(rawBlog);
    mockBlogFindOne.mockReturnValue(query);
    mockTransformBlogWithAuthor.mockReturnValue(frontendBlog as never);

    await expect(getBlogBySlugWithAuthor("gallery-news")).resolves.toBe(
      frontendBlog
    );

    expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
      mockBlogFindOne.mock.invocationCallOrder[0]
    );
    expect(mockBlogFindOne).toHaveBeenCalledWith({ slug: "gallery-news" });
    expect(query.populate).toHaveBeenNthCalledWith(1, "comments");
    expect(query.populate).toHaveBeenNthCalledWith(2, "author");
    expect(mockTransformBlogWithAuthor).toHaveBeenCalledWith(rawBlog);
  });

  it("returns null when the blog entry does not exist", async () => {
    mockBlogFindOne.mockReturnValue(createBlogDetailQuery(null));

    await expect(getBlogBySlugWithAuthor("missing-blog")).resolves.toBeNull();

    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockTransformBlogWithAuthor).not.toHaveBeenCalled();
  });

  it("rejects when blog detail persistence fails", async () => {
    const error = new Error("private blog detail");
    mockBlogFindOne.mockReturnValue(createRejectedBlogDetailQuery(error));

    await expect(getBlogBySlugWithAuthor("gallery-news")).rejects.toThrow(
      error
    );

    expect(mockTransformBlogWithAuthor).not.toHaveBeenCalled();
  });
});
