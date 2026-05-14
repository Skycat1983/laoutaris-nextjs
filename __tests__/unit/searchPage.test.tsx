import type { ReactElement } from "react";
import SearchPage from "@/app/search/page";
import SearchResultsSection from "@/components/modules/search/SearchResultsSection";
import { getPublicSearchResults } from "@/lib/data/services/getPublicSearchResults";

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

describe("/search page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetPublicSearchResults.mockResolvedValue({
      success: true,
      data: {
        blogs: [searchItem],
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
    const resultsSection = resultsGrid.props.children as ReactElement;

    expect(resultsSection.type).toBe(SearchResultsSection);
    expect(resultsSection.props).toEqual({
      title: "Blogs",
      items: [searchItem],
      type: "blogs",
    });
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
      message: "Search type must be articles, blogs, or collections",
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
