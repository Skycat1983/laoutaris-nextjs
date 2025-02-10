import { render, screen } from "@testing-library/react";
import { HomeBiographySectionLoader } from "./HomeBiographySectionLoader";
import { fetchArticles } from "@/lib/api/articleApi";

// Mock the API call
jest.mock("@/lib/api/articleApi", () => ({
  fetchArticles: jest.fn(),
}));

// Mock the HomeBiographySection component that our loader renders
jest.mock("../homepageSections/HomeBiographySection", () => ({
  __esModule: true,
  default: ({ articles }: { articles: any[] }) => (
    <div data-testid="biography-section">
      {articles.map((article) => (
        <div key={article.slug}>{article.title}</div>
      ))}
    </div>
  ),
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
    (fetchArticles as jest.Mock).mockResolvedValue(mockArticles);
    render(await HomeBiographySectionLoader());

    expect(fetchArticles).toHaveBeenCalledWith({
      section: "biography",
      fields: ["title", "subtitle", "slug", "imageUrl"],
    });

    expect(screen.getByText("Test Article")).toBeInTheDocument();
  });

  it("handles errors gracefully", async () => {
    (fetchArticles as jest.Mock).mockRejectedValue(new Error("Fetch failed"));
    const { container } = render(await HomeBiographySectionLoader());
    expect(container.firstChild).toBeNull();
  });
});
