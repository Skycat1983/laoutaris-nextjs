import { render, screen } from "@testing-library/react";
import { HomeBiographySectionLoader } from "@/components/loaders/HomeBiographySectionLoader";
import { fetchArticles } from "@/lib/api/articleApi";

// Mock the API call
jest.mock("@/lib/api/articleApi", () => ({
  fetchArticles: jest.fn(),
}));

describe("HomeBiographySectionLoader", () => {
  const mockArticles = [
    {
      title: "Test Article",
      subtitle: "Test Subtitle",
      slug: "test-article",
      imageUrl: "test.jpg",
      content: "Should not be included in transform",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("successfully fetches and transforms data", async () => {
    // Setup mock return value
    (fetchArticles as jest.Mock).mockResolvedValue(mockArticles);

    render(await HomeBiographySectionLoader());

    // Verify API was called with correct params
    expect(fetchArticles).toHaveBeenCalledWith({
      section: "biography",
      fields: ["title", "subtitle", "slug", "imageUrl"],
    });

    // Verify transformed data is displayed
    expect(screen.getByText("Test Article")).toBeInTheDocument();
  });

  it("handles errors gracefully", async () => {
    // Setup mock to simulate error
    (fetchArticles as jest.Mock).mockRejectedValue(new Error("Fetch failed"));

    const { container } = render(await HomeBiographySectionLoader());

    // Should return null on error
    expect(container.firstChild).toBeNull();
  });
});
