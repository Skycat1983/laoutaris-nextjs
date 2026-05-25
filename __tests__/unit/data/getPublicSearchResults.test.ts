jest.mock("server-only", () => ({}), { virtual: true });

import { ArticleModel } from "@/lib/data/models/articleModel";
import { ArtworkModel } from "@/lib/data/models/artworkModel";
import { BlogModel } from "@/lib/data/models/blogModel";
import { CollectionModel } from "@/lib/data/models/collectionModel";
import { getPublicSearchResults } from "@/lib/data/services/getPublicSearchResults";
import { getShopProductList } from "@/lib/data/services/getShopProductList";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import dbConnect from "@/lib/db/mongodb";

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

jest.mock("@/lib/data/models/blogModel", () => ({
  BlogModel: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

jest.mock("@/lib/data/models/collectionModel", () => ({
  CollectionModel: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

jest.mock("@/lib/data/models/artworkModel", () => ({
  ArtworkModel: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

jest.mock("@/lib/data/services/getShopProductList", () => ({
  getShopProductList: jest.fn(),
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockArticleFind = ArticleModel.find as jest.Mock;
const mockArticleCountDocuments = ArticleModel.countDocuments as jest.Mock;
const mockBlogFind = BlogModel.find as jest.Mock;
const mockBlogCountDocuments = BlogModel.countDocuments as jest.Mock;
const mockCollectionFind = CollectionModel.find as jest.Mock;
const mockCollectionCountDocuments = CollectionModel.countDocuments as jest.Mock;
const mockArtworkFind = ArtworkModel.find as jest.Mock;
const mockArtworkCountDocuments = ArtworkModel.countDocuments as jest.Mock;
const mockGetShopProductList = getShopProductList as jest.MockedFunction<
  typeof getShopProductList
>;

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

const artwork = {
  _id: "artwork-123",
  title: "Blue figure",
  decade: "1980s",
  artstyle: "abstract",
  medium: "oil",
  surface: "canvas",
  featured: false,
  image: {
    secure_url: "https://res.cloudinary.com/demo/image/upload/blue-figure.jpg",
    public_id: "private-public-id",
    bytes: 1234,
    pixelHeight: 1200,
    pixelWidth: 900,
    format: "jpg",
    hexColors: [],
    predominantColors: {
      cloudinary: [],
      google: [],
    },
  },
  collections: [],
  watcherlist: [],
  favourited: [],
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-02T00:00:00.000Z"),
};

const product: SimpleProduct = {
  id: "gid://shopify/Product/101",
  handle: "blue-figure-print",
  title: "Joseph (draft).* print",
  description: "A studio print from the public Shopify product list.",
  descriptionHtml: "<p>A studio print from the public Shopify product list.</p>",
  vendor: "Joseph Laoutaris",
  productType: "print",
  tags: ["blue-figure", "archive"],
  price: "100.00",
  currencyCode: "GBP",
  compareAtPrice: null,
  image: {
    url: "https://cdn.shopify.com/s/files/blue-figure-print.jpg",
    altText: "Blue figure print",
  },
  availableForSale: true,
  variants: [],
};

const otherProduct: SimpleProduct = {
  ...product,
  id: "gid://shopify/Product/102",
  handle: "red-book",
  title: "Red book",
  description: "A publication entry.",
  descriptionHtml: "<p>A publication entry.</p>",
  productType: "book",
  tags: ["publication"],
  image: null,
};

describe("getPublicSearchResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    mockArticleFind.mockReturnValue(createFindChain([article]).query);
    mockArticleCountDocuments.mockResolvedValue(1);
    mockBlogFind.mockReturnValue(createFindChain([blog]).query);
    mockBlogCountDocuments.mockResolvedValue(1);
    mockCollectionFind.mockReturnValue(createFindChain([collection]).query);
    mockCollectionCountDocuments.mockResolvedValue(1);
    mockArtworkFind.mockReturnValue(createFindChain([artwork]).query);
    mockArtworkCountDocuments.mockResolvedValue(1);
    mockGetShopProductList.mockResolvedValue({
      success: true,
      data: [product, otherProduct],
      metadata: {
        totalArtworks: 2,
        totalProducts: 2,
      },
    });
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
    const artworkFilter = mockArtworkFind.mock.calls[0][0];
    const artworkTitleRegex = artworkFilter.$or[0].title as RegExp;

    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(titleRegex).toBeInstanceOf(RegExp);
    expect(titleRegex.source).toContain("\\(draft\\)\\.\\*");
    expect(titleRegex.test("Joseph (draft).*")).toBe(true);
    expect(titleRegex.test("Joseph draftxxx")).toBe(false);
    expect(artworkTitleRegex).toBeInstanceOf(RegExp);
    expect(artworkTitleRegex.source).toContain("\\(draft\\)\\.\\*");
    expect(articleChain.skip).toHaveBeenCalledWith(10);
    expect(articleChain.limit).toHaveBeenCalledWith(5);
    expect(mockGetShopProductList).not.toHaveBeenCalled();
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
        artworks: [
          {
            title: "Blue figure",
            subtitle: "1980s, Abstract",
            summary: "Oil on Canvas",
            imageUrl:
              "https://res.cloudinary.com/demo/image/upload/blue-figure.jpg",
            linkTo: "/artwork/artwork-123",
          },
        ],
        metadata: {
          page: 3,
          limit: 5,
          searchedTypes: ["articles", "blogs", "collections", "artworks"],
          total: 4,
          hasMore: false,
          types: {
            articles: {
              page: 3,
              limit: 5,
              total: 1,
              totalPages: 1,
              hasMore: false,
              hasPreviousPage: true,
            },
            blogs: {
              page: 3,
              limit: 5,
              total: 1,
              totalPages: 1,
              hasMore: false,
              hasPreviousPage: true,
            },
            collections: {
              page: 3,
              limit: 5,
              total: 1,
              totalPages: 1,
              hasMore: false,
              hasPreviousPage: true,
            },
            artworks: {
              page: 3,
              limit: 5,
              total: 1,
              totalPages: 1,
              hasMore: false,
              hasPreviousPage: true,
            },
          },
        },
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
    expect(mockArtworkFind).not.toHaveBeenCalled();
    expect(mockGetShopProductList).not.toHaveBeenCalled();
    expect(mockArticleCountDocuments).not.toHaveBeenCalled();
    expect(mockCollectionCountDocuments).not.toHaveBeenCalled();
    expect(mockArtworkCountDocuments).not.toHaveBeenCalled();
    expect(mockBlogFind).toHaveBeenCalledTimes(1);
    expect(mockBlogCountDocuments).toHaveBeenCalledTimes(1);
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
        metadata: {
          page: 1,
          limit: 10,
          searchedTypes: ["blogs"],
          total: 1,
          hasMore: false,
          types: {
            blogs: {
              page: 1,
              limit: 10,
              total: 1,
              totalPages: 1,
              hasMore: false,
              hasPreviousPage: false,
            },
          },
        },
      },
    });
  });

  it("honors selected artwork searches with title regex and exact taxonomy matching", async () => {
    const artworkChain = createFindChain([artwork]);
    mockArtworkFind.mockReturnValue(artworkChain.query);

    const result = await getPublicSearchResults({
      q: "abstract",
      type: "artworks",
      page: 2,
      limit: 5,
    });

    const artworkFilter = mockArtworkFind.mock.calls[0][0];
    const titleRegex = artworkFilter.$or[0].title as RegExp;

    expect(mockArticleFind).not.toHaveBeenCalled();
    expect(mockBlogFind).not.toHaveBeenCalled();
    expect(mockCollectionFind).not.toHaveBeenCalled();
    expect(mockGetShopProductList).not.toHaveBeenCalled();
    expect(mockArticleCountDocuments).not.toHaveBeenCalled();
    expect(mockBlogCountDocuments).not.toHaveBeenCalled();
    expect(mockCollectionCountDocuments).not.toHaveBeenCalled();
    expect(mockArtworkFind).toHaveBeenCalledTimes(1);
    expect(mockArtworkCountDocuments).toHaveBeenCalledTimes(1);
    expect(titleRegex.source).toBe("abstract");
    expect(artworkFilter.$or).toContainEqual({ artstyle: "abstract" });
    expect(artworkChain.skip).toHaveBeenCalledWith(5);
    expect(artworkChain.limit).toHaveBeenCalledWith(5);
    expect(result).toEqual({
      success: true,
      data: {
        artworks: [
          {
            title: "Blue figure",
            subtitle: "1980s, Abstract",
            summary: "Oil on Canvas",
            imageUrl:
              "https://res.cloudinary.com/demo/image/upload/blue-figure.jpg",
            linkTo: "/artwork/artwork-123",
          },
        ],
        metadata: {
          page: 2,
          limit: 5,
          searchedTypes: ["artworks"],
          total: 1,
          hasMore: false,
          types: {
            artworks: {
              page: 2,
              limit: 5,
              total: 1,
              totalPages: 1,
              hasMore: false,
              hasPreviousPage: true,
            },
          },
        },
      },
    });
  });

  it("honors selected shop product searches through the public product list service", async () => {
    const result = await getPublicSearchResults({
      q: "blue-figure",
      type: "shop-products",
      page: 1,
      limit: 1,
    });

    expect(mockArticleFind).not.toHaveBeenCalled();
    expect(mockBlogFind).not.toHaveBeenCalled();
    expect(mockCollectionFind).not.toHaveBeenCalled();
    expect(mockArtworkFind).not.toHaveBeenCalled();
    expect(mockArticleCountDocuments).not.toHaveBeenCalled();
    expect(mockBlogCountDocuments).not.toHaveBeenCalled();
    expect(mockCollectionCountDocuments).not.toHaveBeenCalled();
    expect(mockArtworkCountDocuments).not.toHaveBeenCalled();
    expect(mockGetShopProductList).toHaveBeenCalledWith();
    expect(result).toEqual({
      success: true,
      data: {
        "shop-products": [
          {
            title: "Joseph (draft).* print",
            subtitle: "Print, Joseph Laoutaris",
            summary: "Blue Figure, Archive",
            imageUrl: "https://cdn.shopify.com/s/files/blue-figure-print.jpg",
            linkTo: "/shop/products/blue-figure-print",
          },
        ],
        metadata: {
          page: 1,
          limit: 1,
          searchedTypes: ["shop-products"],
          total: 1,
          hasMore: false,
          types: {
            "shop-products": {
              page: 1,
              limit: 1,
              total: 1,
              totalPages: 1,
              hasMore: false,
              hasPreviousPage: false,
            },
          },
        },
      },
    });
  });

  it("keeps shop products behind explicit type filtering for all-type searches", async () => {
    const result = await getPublicSearchResults({
      q: "blue-figure",
      page: 1,
      limit: 10,
    });

    expect(mockGetShopProductList).not.toHaveBeenCalled();
    expect(result.data["shop-products"]).toBeUndefined();
    expect(result.data.metadata.searchedTypes).toEqual([
      "articles",
      "blogs",
      "collections",
      "artworks",
    ]);
    expect(result.data.metadata.types["shop-products"]).toBeUndefined();
    expect(result.data.metadata.total).toBe(4);
  });

  it("marks explicit shop product searches unavailable when product lookup fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mockGetShopProductList.mockRejectedValue(
      new Error("private Shopify outage")
    );

    const result = await getPublicSearchResults({
      q: "blue-figure",
      type: "shop-products",
      page: 1,
      limit: 10,
    });

    expect(mockArticleFind).not.toHaveBeenCalled();
    expect(mockBlogFind).not.toHaveBeenCalled();
    expect(mockCollectionFind).not.toHaveBeenCalled();
    expect(mockArtworkFind).not.toHaveBeenCalled();
    expect(mockGetShopProductList).toHaveBeenCalledWith();
    expect(result).toEqual({
      success: true,
      data: {
        "shop-products": [],
        metadata: {
          page: 1,
          limit: 10,
          searchedTypes: ["shop-products"],
          total: 0,
          hasMore: false,
          unavailableTypes: ["shop-products"],
          types: {
            "shop-products": {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasMore: false,
              hasPreviousPage: false,
            },
          },
        },
      },
    });

    const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
    expect(logPayload).toEqual(
      expect.objectContaining({
        level: "error",
        event: "service.public_search.shop_products.failed",
        surface: "data_service",
        operation: "public_search",
        provider: "shopify",
        shopifyOperation: "getShopProductList",
        statusCategory: "shop_product_search_unavailable",
        error: {
          name: "Error",
          message: "private Shopify outage",
        },
      })
    );
    consoleErrorSpy.mockRestore();
  });

  it("returns selected-type zero-result metadata without querying other types", async () => {
    const blogChain = createFindChain([]);
    mockBlogFind.mockReturnValue(blogChain.query);
    mockBlogCountDocuments.mockResolvedValue(0);

    const result = await getPublicSearchResults({
      q: "missing",
      type: "blogs",
      page: 1,
      limit: 10,
    });

    expect(mockArticleFind).not.toHaveBeenCalled();
    expect(mockCollectionFind).not.toHaveBeenCalled();
    expect(mockArtworkFind).not.toHaveBeenCalled();
    expect(mockGetShopProductList).not.toHaveBeenCalled();
    expect(mockBlogFind).toHaveBeenCalledTimes(1);
    expect(mockBlogCountDocuments).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      success: true,
      data: {
        blogs: [],
        metadata: {
          page: 1,
          limit: 10,
          searchedTypes: ["blogs"],
          total: 0,
          hasMore: false,
          types: {
            blogs: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasMore: false,
              hasPreviousPage: false,
            },
          },
        },
      },
    });
  });
});
