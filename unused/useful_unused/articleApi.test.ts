import {
  fetchArticles,
  fetchArticle,
  fetchArticleArtwork,
} from "../../src/lib/api/public/articleApi";
import { headers } from "next/headers";

// Mock next/headers
jest.mock("next/headers", () => ({
  headers: jest.fn(() => new Headers()),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe("articleApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchArticles", () => {
    it("should fetch articles with default parameters", async () => {
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      await fetchArticles();

      // Verify fetch was called with correct URL and default params
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.BASEURL}/api/v2/article?limit=10&page=1`,
        expect.any(Object)
      );
    });

    it("should include all query parameters when provided", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      await fetchArticles({
        section: "biography",
        fields: ["title", "content"],
        limit: 5,
        page: 2,
      });

      // Test that fetch was called exactly once
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Get the URL that was actually called
      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];

      // Test each parameter individually
      expect(calledUrl).toContain("section=biography");
      expect(calledUrl).toContain("fields=title%2Ccontent"); // Note the encoded comma
      expect(calledUrl).toContain("limit=5");
      expect(calledUrl).toContain("page=2");
    });

    it("should throw error when API returns error response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            success: false,
            error: "API Error",
          }),
      });

      await expect(fetchArticles()).rejects.toThrow("API Error");
    });
  });

  describe("fetchArticle", () => {
    it("should fetch a single article by slug", async () => {
      const mockArticle = { id: 1, title: "Test Article" };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, data: mockArticle }),
      });

      const result = await fetchArticle("test-slug");

      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.BASEURL}/api/v2/article/test-slug`,
        expect.any(Object)
      );
      expect(result).toEqual(mockArticle);
    });
  });

  describe("fetchArticleArtwork", () => {
    it("should fetch artwork for an article", async () => {
      const mockArtwork = { artworks: [{ url: "test.jpg" }] };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, data: mockArtwork }),
      });

      const result = await fetchArticleArtwork("test-slug");

      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.BASEURL}/api/v2/article/test-slug/artwork`,
        expect.any(Object)
      );
      expect(result).toEqual(mockArtwork);
    });
  });
});
