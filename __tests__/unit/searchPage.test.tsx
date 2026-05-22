import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SearchPage from "@/app/search/page";
import SearchResultsSection from "@/components/modules/search/SearchResultsSection";
import { getPublicSearchResults } from "@/lib/data/services/getPublicSearchResults";
import type {
  SearchableContentType,
  SearchResponseMetadata,
} from "@/lib/data/types/searchTypes";

jest.mock("@/lib/data/services/getPublicSearchResults", () => ({
  getPublicSearchResults: jest.fn(),
}));

jest.mock("@/components/modules/search/SearchResultsSection", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

const mockGetPublicSearchResults = getPublicSearchResults as jest.MockedFunction<
  typeof getPublicSearchResults
>;

const searchItem = {
  title: "Studio update",
  subtitle: "New works",
  summary: "A short blog summary",
  imageUrl: "/blog.jpg",
  slug: "studio-update",
  linkTo: "/blog/studio-update",
} as never;

const artworkItem = {
  title: "Blue figure",
  subtitle: "1980s, Abstract",
  summary: "Oil on Canvas",
  imageUrl: "https://res.cloudinary.com/demo/image/upload/blue-figure.jpg",
  linkTo: "/artwork/artwork-123",
} as never;

const shopProductItem = {
  title: "Blue figure print",
  subtitle: "Print, Joseph Laoutaris",
  summary: "Blue Figure, Archive",
  imageUrl: "https://cdn.shopify.com/s/files/blue-figure-print.jpg",
  linkTo: "/shop/products/blue-figure-print",
} as never;

const createMetadata = ({
  page = 1,
  limit = 10,
  total = 1,
  totalPages = 1,
  hasMore = false,
  hasPreviousPage = false,
  searchedTypes = ["blogs"],
  type = "blogs",
}: {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasMore?: boolean;
  hasPreviousPage?: boolean;
  searchedTypes?: SearchableContentType[];
  type?: SearchableContentType;
} = {}): SearchResponseMetadata => ({
  page,
  limit,
  searchedTypes,
  total,
  hasMore,
  types: {
    [type]: {
      page,
      limit,
      total,
      totalPages,
      hasMore,
      hasPreviousPage,
    },
  },
});

describe("/search page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetPublicSearchResults.mockResolvedValue({
      success: true,
      data: {
        blogs: [searchItem],
        metadata: createMetadata(),
      },
    });
  });

  it("loads initial results through the server data service without same-app fetches", async () => {
    const element = (await SearchPage({
      searchParams: {
        q: " studio ",
        type: "blogs",
        page: "2",
        limit: "5",
      },
    })) as ReactElement;

    expect(mockGetPublicSearchResults).toHaveBeenCalledWith({
      q: "studio",
      type: "blogs",
      page: 2,
      limit: 5,
    });
    expect(global.fetch).not.toHaveBeenCalled();

    const resultsGrid = element.props.children[1] as ReactElement;
    const resultsFragment = resultsGrid.props.children as ReactElement;
    const resultsSection = resultsFragment.props.children[0] as ReactElement;

    expect(resultsSection.type).toBe(SearchResultsSection);
    expect(resultsSection.props).toEqual({
      title: "Blogs",
      items: [searchItem],
      type: "blogs",
      resultLabel: "blogs",
      total: 1,
      emptyMessage: undefined,
    });
  });

  it("renders a selected-type no-results state with backed zero-result metadata", async () => {
    mockGetPublicSearchResults.mockResolvedValue({
      success: true,
      data: {
        blogs: [],
        metadata: createMetadata({ total: 0, totalPages: 0 }),
      },
    });

    const element = (await SearchPage({
      searchParams: {
        q: "missing",
        type: "blogs",
      },
    })) as ReactElement;
    const resultsGrid = element.props.children[1] as ReactElement;
    const resultsFragment = resultsGrid.props.children as ReactElement;
    const resultsSection = resultsFragment.props.children[0] as ReactElement;

    expect(resultsSection.type).toBe(SearchResultsSection);
    expect(resultsSection.props).toEqual({
      title: "Blogs",
      items: [],
      type: "blogs",
      resultLabel: "blogs",
      total: 0,
      emptyMessage: 'No blogs matched "missing".',
    });
  });

  it("renders a selected artwork no-results state with backed zero-result metadata", async () => {
    mockGetPublicSearchResults.mockResolvedValue({
      success: true,
      data: {
        artworks: [],
        metadata: createMetadata({
          total: 0,
          totalPages: 0,
          searchedTypes: ["artworks"],
          type: "artworks",
        }),
      },
    });

    const element = (await SearchPage({
      searchParams: {
        q: "missing",
        type: "artworks",
      },
    })) as ReactElement;
    const resultsGrid = element.props.children[1] as ReactElement;
    const resultsFragment = resultsGrid.props.children as ReactElement;
    const resultsSection = resultsFragment.props.children[0] as ReactElement;

    expect(resultsSection.type).toBe(SearchResultsSection);
    expect(resultsSection.props).toEqual({
      title: "Artworks",
      items: [],
      type: "artworks",
      resultLabel: "artworks",
      total: 0,
      emptyMessage: 'No artworks matched "missing".',
    });
  });

  it("renders a selected shop product no-results state with backed zero-result metadata", async () => {
    mockGetPublicSearchResults.mockResolvedValue({
      success: true,
      data: {
        "shop-products": [],
        metadata: createMetadata({
          total: 0,
          totalPages: 0,
          searchedTypes: ["shop-products"],
          type: "shop-products",
        }),
      },
    });

    const element = (await SearchPage({
      searchParams: {
        q: "missing",
        type: "shop-products",
      },
    })) as ReactElement;
    const resultsGrid = element.props.children[1] as ReactElement;
    const resultsFragment = resultsGrid.props.children as ReactElement;
    const resultsSection = resultsFragment.props.children[0] as ReactElement;

    expect(resultsSection.type).toBe(SearchResultsSection);
    expect(resultsSection.props).toEqual({
      title: "Shop Products",
      items: [],
      type: "shop-products",
      resultLabel: "shop products",
      total: 0,
      emptyMessage: 'No shop products matched "missing".',
    });
  });

  it("renders artwork sections in all-type search results", async () => {
    mockGetPublicSearchResults.mockResolvedValue({
      success: true,
      data: {
        articles: [],
        blogs: [],
        collections: [],
        artworks: [artworkItem],
        metadata: {
          page: 1,
          limit: 10,
          searchedTypes: ["articles", "blogs", "collections", "artworks"],
          total: 1,
          hasMore: false,
          types: {
            articles: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasMore: false,
              hasPreviousPage: false,
            },
            blogs: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasMore: false,
              hasPreviousPage: false,
            },
            collections: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasMore: false,
              hasPreviousPage: false,
            },
            artworks: {
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

    const element = (await SearchPage({
      searchParams: {
        q: "blue",
      },
    })) as ReactElement;
    renderToStaticMarkup(element);

    expect(SearchResultsSection).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Artworks",
        items: [artworkItem],
        type: "artworks",
        resultLabel: "artworks",
        total: 1,
      }),
      {}
    );
  });

  it("renders shop product sections in all-type search results", async () => {
    mockGetPublicSearchResults.mockResolvedValue({
      success: true,
      data: {
        articles: [],
        blogs: [],
        collections: [],
        artworks: [],
        "shop-products": [shopProductItem],
        metadata: {
          page: 1,
          limit: 10,
          searchedTypes: [
            "articles",
            "blogs",
            "collections",
            "artworks",
            "shop-products",
          ],
          total: 1,
          hasMore: false,
          types: {
            articles: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasMore: false,
              hasPreviousPage: false,
            },
            blogs: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasMore: false,
              hasPreviousPage: false,
            },
            collections: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasMore: false,
              hasPreviousPage: false,
            },
            artworks: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasMore: false,
              hasPreviousPage: false,
            },
            "shop-products": {
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

    const element = (await SearchPage({
      searchParams: {
        q: "blue",
      },
    })) as ReactElement;
    renderToStaticMarkup(element);

    expect(SearchResultsSection).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Shop Products",
        items: [shopProductItem],
        type: "shop-products",
        resultLabel: "shop products",
        total: 1,
      }),
      {}
    );
  });

  it("renders an all-type no-results state without selected-type pagination", async () => {
    mockGetPublicSearchResults.mockResolvedValue({
      success: true,
      data: {
        articles: [],
        blogs: [],
        collections: [],
        metadata: {
          page: 1,
          limit: 10,
          searchedTypes: [
            "articles",
            "blogs",
            "collections",
            "artworks",
            "shop-products",
          ],
          total: 0,
          hasMore: false,
          types: {
            articles: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasMore: false,
              hasPreviousPage: false,
            },
            blogs: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasMore: false,
              hasPreviousPage: false,
            },
            collections: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasMore: false,
              hasPreviousPage: false,
            },
            artworks: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasMore: false,
              hasPreviousPage: false,
            },
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

    const element = (await SearchPage({
      searchParams: {
        q: "missing",
      },
    })) as ReactElement;
    const markup = renderToStaticMarkup(element);

    expect(markup).toContain(
      'No articles, blogs, collections, artworks, or shop products matched &quot;missing&quot;.'
    );
    expect(markup).not.toContain("search pagination");
  });

  it("renders selected-type pagination from service metadata", async () => {
    mockGetPublicSearchResults.mockResolvedValue({
      success: true,
      data: {
        blogs: [searchItem],
        metadata: createMetadata({
          page: 2,
          limit: 5,
          total: 12,
          totalPages: 3,
          hasMore: true,
          hasPreviousPage: true,
        }),
      },
    });

    const element = (await SearchPage({
      searchParams: {
        q: "studio",
        type: "blogs",
        page: "2",
        limit: "5",
      },
    })) as ReactElement;
    const markup = renderToStaticMarkup(element);

    expect(markup).toContain("Page 2 of 3");
    expect(markup).toContain(
      "/search?q=studio&amp;type=blogs&amp;page=1&amp;limit=5"
    );
    expect(markup).toContain(
      "/search?q=studio&amp;type=blogs&amp;page=3&amp;limit=5"
    );
  });

  it("does not call the service when query validation fails", async () => {
    const element = (await SearchPage({
      searchParams: {
        q: "studio",
        type: "artwork",
      },
    })) as ReactElement;

    expect(mockGetPublicSearchResults).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.props).toEqual({
      title: "Search Error",
      message:
        "Search type must be articles, blogs, collections, artworks, or shop-products",
    });
  });

  it("preserves the empty-query prompt without hitting the service", async () => {
    const element = (await SearchPage({
      searchParams: {},
    })) as ReactElement;

    expect(mockGetPublicSearchResults).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.props).toEqual({
      title: "Search",
      message: "Please enter a search term",
    });
  });
});
