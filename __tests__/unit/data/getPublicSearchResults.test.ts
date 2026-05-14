jest.mock("server-only", () => ({}), { virtual: true });

import { ArticleModel } from "@/lib/data/models/articleModel";
import { BlogModel } from "@/lib/data/models/blogModel";
import { CollectionModel } from "@/lib/data/models/collectionModel";
import { getPublicSearchResults } from "@/lib/data/services/getPublicSearchResults";
import dbConnect from "@/lib/db/mongodb";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/articleModel", () => ({
  ArticleModel: {
    find: jest.fn(),
  },
}));

jest.mock("@/lib/data/models/blogModel", () => ({
  BlogModel: {
    find: jest.fn(),
  },
}));

jest.mock("@/lib/data/models/collectionModel", () => ({
  CollectionModel: {
    find: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockArticleFind = ArticleModel.find as jest.Mock;
const mockBlogFind = BlogModel.find as jest.Mock;
const mockCollectionFind = CollectionModel.find as jest.Mock;

const createFindChain = (results: unknown[]) => {
  const lean = jest.fn().mockResolvedValue(results);
  const limit = jest.fn(() => ({ lean }));
  const skip = jest.fn(() => ({ limit }));

  return {
    query: { skip },
    skip,
    limit,
    lean,
  };
};

const article = {
  title: "Joseph Laoutaris",
  subtitle: "Archive note",
  summary: "A short article summary",
  text: "Article body",
  imageUrl: "/article.jpg",
  slug: "joseph-laoutaris",
  section: "biography",
};

const blog = {
  title: "Studio update",
  subtitle: "New works",
  summary: "A short blog summary",
  text: "Blog body",
  imageUrl: "/blog.jpg",
  slug: "studio-update",
};

const collection = {
  title: "Works on paper",
  subtitle: "Collection",
  summary: "A short collection summary",
  text: "Collection body",
  imageUrl: "/collection.jpg",
  slug: "works-on-paper",
};

describe("getPublicSearchResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    mockArticleFind.mockReturnValue(createFindChain([article]).query);
    mockBlogFind.mockReturnValue(createFindChain([blog]).query);
    mockCollectionFind.mockReturnValue(createFindChain([collection]).query);
  });

  it("owns MongoDB connection, escapes regex input, paginates, and shapes DTOs", async () => {
    const articleChain = createFindChain([article]);
    mockArticleFind.mockReturnValue(articleChain.query);

    const result = await getPublicSearchResults({
      q: "Joseph (draft).*",
      page: 3,
      limit: 5,
    });

    const filter = mockArticleFind.mock.calls[0][0];
    const titleRegex = filter.$or[0].title as RegExp;

    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(titleRegex).toBeInstanceOf(RegExp);
    expect(titleRegex.source).toContain("\\(draft\\)\\.\\*");
    expect(titleRegex.test("Joseph (draft).*")).toBe(true);
    expect(titleRegex.test("Joseph draftxxx")).toBe(false);
    expect(articleChain.skip).toHaveBeenCalledWith(10);
    expect(articleChain.limit).toHaveBeenCalledWith(5);
    expect(result).toEqual({
      success: true,
      data: {
        articles: [
          {
            title: "Joseph Laoutaris",
            subtitle: "Archive note",
            summary: "A short article summary",
            imageUrl: "/article.jpg",
            slug: "joseph-laoutaris",
            linkTo: "/biography/joseph-laoutaris",
          },
        ],
        blogs: [
          {
            title: "Studio update",
            subtitle: "New works",
            summary: "A short blog summary",
            imageUrl: "/blog.jpg",
            slug: "studio-update",
            linkTo: "/blog/studio-update",
          },
        ],
        collections: [
          {
            title: "Works on paper",
            subtitle: "Collection",
            summary: "A short collection summary",
            imageUrl: "/collection.jpg",
            slug: "works-on-paper",
            linkTo: "/collections/works-on-paper",
          },
        ],
      },
    });
  });

  it("honors type filtering by querying and returning only the requested set", async () => {
    const blogChain = createFindChain([blog]);
    mockBlogFind.mockReturnValue(blogChain.query);

    const result = await getPublicSearchResults({
      q: "studio",
      type: "blogs",
      page: 1,
      limit: 10,
    });

    expect(mockArticleFind).not.toHaveBeenCalled();
    expect(mockCollectionFind).not.toHaveBeenCalled();
    expect(mockBlogFind).toHaveBeenCalledTimes(1);
    expect(blogChain.skip).toHaveBeenCalledWith(0);
    expect(blogChain.limit).toHaveBeenCalledWith(10);
    expect(result).toEqual({
      success: true,
      data: {
        blogs: [
          {
            title: "Studio update",
            subtitle: "New works",
            summary: "A short blog summary",
            imageUrl: "/blog.jpg",
            slug: "studio-update",
            linkTo: "/blog/studio-update",
          },
        ],
      },
    });
  });
});
