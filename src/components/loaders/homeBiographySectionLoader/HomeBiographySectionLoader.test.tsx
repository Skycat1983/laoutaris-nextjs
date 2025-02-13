// tests go here:

import { render, screen } from "@testing-library/react";
import { HomeBiographySectionLoader } from "./BiographySectionLoader";
import { fetchArticles } from "@/lib/api/articleApi";
import { HomeBiographySection } from "@/components/contentSections/HomeBiographySection";

// Mock dependencies
jest.mock("@/lib/api/articleApi");
jest.mock("@/components/contentSections/HomeBiographySection");

// Mock data
const mockArticles = [
  {
    title: "Test Biography",
    subtitle: "Test Subtitle",
    slug: "test-biography",
    imageUrl: "/test-image.jpg",
    content: "Test content", //  will be stripped by transformToPick
  },
];

const expectedTransformedData = [
  {
    title: "Test Biography",
    subtitle: "Test Subtitle",
    slug: "test-biography",
    imageUrl: "/test-image.jpg",
  },
];

describe("HomeBiographySectionLoader", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock HomeBiographySection to return a div for easier testing
    (HomeBiographySection as jest.Mock).mockImplementation(({ articles }) => (
      <div data-testid="biography-section">{articles.length} articles</div>
    ));

    // Suppress console.error for clean test output
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test
    jest.restoreAllMocks();
  });

  it("should fetch and render biography articles successfully", async () => {
    // Mock successful API response
    (fetchArticles as jest.Mock).mockResolvedValue(mockArticles);

    // Render the component
    const { container } = render(await HomeBiographySectionLoader());

    // Verify API was called with correct parameters
    expect(fetchArticles).toHaveBeenCalledWith({
      section: "biography",
      fields: ["title", "subtitle", "slug", "imageUrl"],
    });

    // Verify HomeBiographySection was rendered with transformed data
    expect(HomeBiographySection).toHaveBeenCalledWith(
      { articles: expectedTransformedData },
      expect.anything()
    );

    // Verify the component is rendered
    expect(screen.getByTestId("biography-section")).toBeInTheDocument();
  });

  it("should handle API errors gracefully", async () => {
    // Mock API error
    (fetchArticles as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch articles")
    );

    // Render the component
    const { container } = render(await HomeBiographySectionLoader());

    // Verify API was called
    expect(fetchArticles).toHaveBeenCalled();

    // Verify error handling (component should return null)
    expect(container.firstChild).toBeNull();
  });

  it("should transform data correctly", async () => {
    // Mock API response with extra fields that should be stripped
    const articlesWithExtraFields = [
      {
        ...mockArticles[0],
        extraField: "should be removed",
        anotherField: "should also be removed",
      },
    ];

    (fetchArticles as jest.Mock).mockResolvedValue(articlesWithExtraFields);

    // Render the component
    render(await HomeBiographySectionLoader());

    // Verify HomeBiographySection was called with correctly transformed data
    expect(HomeBiographySection).toHaveBeenCalledWith(
      { articles: expectedTransformedData },
      expect.anything()
    );
  });
});
