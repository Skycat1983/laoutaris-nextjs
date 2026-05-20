jest.mock("server-only", () => ({}), { virtual: true });

import { GET as GET_ARTICLE_NAVIGATION } from "@/app/api/v2/public/navigation/articles/[section]/route";
import { GET as GET_COLLECTION_NAVIGATION_LIST } from "@/app/api/v2/public/navigation/collections/route";
import { GET as GET_COLLECTION_NAVIGATION_DETAIL } from "@/app/api/v2/public/navigation/collections/[slug]/route";
import { GET as GET_COLLECTION_ARTWORKS_NAVIGATION } from "@/app/api/v2/public/navigation/collections/[slug]/artworks/route";
import { CollectionModel } from "@/lib/data/models";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";
import { getCollectionNavigationItem } from "@/lib/data/services/getCollectionNavigationItem";
import { getCollectionNavigationList } from "@/lib/data/services/getCollectionNavigationList";
import dbConnect from "@/lib/db/mongodb";
import { REQUEST_ID_HEADER } from "@/lib/observability/requestContext";
import { transformCollectionPopulated } from "@/lib/transforms";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      headers: new Headers(init?.headers),
      json: async () => body,
    })),
  },
}));

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models", () => ({
  CollectionModel: {
    find: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock("@/lib/data/services/getArticleNavigationList", () => ({
  getArticleNavigationList: jest.fn(),
}));

jest.mock("@/lib/data/services/getCollectionNavigationList", () => ({
  getCollectionNavigationList: jest.fn(),
}));

jest.mock("@/lib/data/services/getCollectionNavigationItem", () => ({
  getCollectionNavigationItem: jest.fn(),
}));

jest.mock("@/lib/transforms/navigation/transformNavData", () => ({
  transformBiographyNav: {
    toFrontend: jest.fn(),
  },
}));

jest.mock("@/lib/transforms", () => ({
  transformCollectionPopulated: jest.fn(),
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockCollectionFindOne = CollectionModel.findOne as jest.Mock;
const mockGetArticleNavigationList =
  getArticleNavigationList as jest.MockedFunction<
    typeof getArticleNavigationList
  >;
const mockGetCollectionNavigationList =
  getCollectionNavigationList as jest.MockedFunction<
    typeof getCollectionNavigationList
  >;
const mockGetCollectionNavigationItem =
  getCollectionNavigationItem as jest.MockedFunction<
    typeof getCollectionNavigationItem
  >;
const mockTransformCollectionPopulated =
  transformCollectionPopulated as jest.MockedFunction<
    typeof transformCollectionPopulated
  >;

const requestId = "req-public-navigation";
const request = {
  method: "GET",
  headers: new Headers({ "x-request-id": requestId }),
} as never;

const createArticleParams = (section = "biography") => ({
  params: { section },
});

const createCollectionParams = (slug: string) => ({
  params: { slug },
});

const createPopulatedCollectionQuery = (result: unknown) => {
  const query = {
    populate: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.populate.mockReturnValue(query);
  return query;
};

const createRejectedPopulatedCollectionQuery = (error: unknown) => {
  const query = {
    populate: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.populate.mockReturnValue(query);
  return query;
};

describe("public navigation routes", () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe("GET /api/v2/public/navigation/articles/[section]", () => {
    it("returns article navigation with existing metadata", async () => {
      const navItems = [
        { slug: "early-life", title: "Early Life", linkTo: "/early-life" },
        { slug: "studio-years", title: "Studio Years", linkTo: "/studio" },
      ];
      mockGetArticleNavigationList.mockResolvedValue({
        success: true,
        data: navItems,
        metadata: {
          total: 2,
          page: 1,
          limit: 2,
          totalPages: 1,
        },
      });

      const response = await GET_ARTICLE_NAVIGATION(
        request,
        createArticleParams("biography") as never
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockGetArticleNavigationList).toHaveBeenCalledWith("biography");
      expect(body).toEqual({
        success: true,
        data: navItems,
        metadata: {
          total: 2,
          page: 1,
          limit: 2,
          totalPages: 1,
        },
      });
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("returns 404 when no article navigation items exist", async () => {
      mockGetArticleNavigationList.mockResolvedValue(null);

      const response = await GET_ARTICLE_NAVIGATION(
        request,
        createArticleParams("project") as never
      );
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({
        success: false,
        message: "No articles found",
        error: "No articles found",
      });
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("rejects invalid article navigation sections before calling the service", async () => {
      const response = await GET_ARTICLE_NAVIGATION(
        request,
        createArticleParams("collections") as never
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(mockGetArticleNavigationList).not.toHaveBeenCalled();
      expect(body).toEqual({
        success: false,
        error: "Invalid article navigation query",
        fieldErrors: {
          section: expect.arrayContaining([expect.any(String)]),
        },
        formErrors: [],
      });
    });

    it("returns a public-safe 500 when article navigation fails", async () => {
      mockGetArticleNavigationList.mockRejectedValue(
        new Error("private article nav")
      );

      const response = await GET_ARTICLE_NAVIGATION(
        request,
        createArticleParams("biography") as never
      );
      const body = await response.json();
      const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      expect(response.status).toBe(500);
      expect(response.headers.get(REQUEST_ID_HEADER)).toBe(requestId);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch article navigation",
        error: "Failed to fetch article navigation",
        requestId,
      });
      expect(logPayload).toEqual(
        expect.objectContaining({
          requestId,
          route: "/api/v2/public/navigation/articles/[section]",
          method: "GET",
          errorLabel: "article_navigation_read_failed",
        })
      );
      expect(JSON.stringify(body)).not.toContain("private article nav");
    });
  });

  describe("GET /api/v2/public/navigation/collections", () => {
    it("returns collection navigation with existing metadata", async () => {
      const navItems = [
        {
          slug: "paintings",
          title: "Paintings",
          firstArtworkId: "artwork-1",
          hasArtwork: true,
        },
        {
          slug: "drawings",
          title: "Drawings",
          firstArtworkId: null,
          hasArtwork: false,
        },
      ];
      mockGetCollectionNavigationList.mockResolvedValue({
        success: true,
        data: navItems,
        metadata: {
          total: 2,
          page: 1,
          limit: 2,
          totalPages: 1,
        },
      });

      const response = await GET_COLLECTION_NAVIGATION_LIST(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockGetCollectionNavigationList).toHaveBeenCalledWith();
      expect(body).toEqual({
        success: true,
        data: navItems,
        metadata: {
          total: 2,
          page: 1,
          limit: 2,
          totalPages: 1,
        },
      });
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("returns 404 when no collection navigation items exist", async () => {
      mockGetCollectionNavigationList.mockResolvedValue(null);

      const response = await GET_COLLECTION_NAVIGATION_LIST(request);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({
        success: false,
        message: "No collections found",
        error: "No collections found",
      });
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("returns a public-safe 500 when collection navigation fails", async () => {
      mockGetCollectionNavigationList.mockRejectedValue(
        new Error("private collection nav")
      );

      const response = await GET_COLLECTION_NAVIGATION_LIST(request);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(response.headers.get(REQUEST_ID_HEADER)).toBe(requestId);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch collection navigation",
        error: "Failed to fetch collection navigation",
        requestId,
      });
      expect(JSON.stringify(body)).not.toContain("private collection nav");
    });
  });

  describe("GET /api/v2/public/navigation/collections/[slug]", () => {
    it("returns a single collection navigation item", async () => {
      const navItem = {
        slug: "paintings",
        title: "Paintings",
        linkTo: "/paintings",
      };
      mockGetCollectionNavigationItem.mockResolvedValue(navItem as never);

      const response = await GET_COLLECTION_NAVIGATION_DETAIL(
        request,
        createCollectionParams("paintings")
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockGetCollectionNavigationItem).toHaveBeenCalledWith(
        "paintings"
      );
      expect(body).toEqual({
        success: true,
        data: navItem,
      });
    });

    it("returns 404 when the collection navigation target is missing", async () => {
      mockGetCollectionNavigationItem.mockResolvedValue(null);

      const response = await GET_COLLECTION_NAVIGATION_DETAIL(
        request,
        createCollectionParams("missing")
      );
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({
        success: false,
        message: "Collection not found",
        error: "Collection not found",
      });
    });

    it("returns a public-safe 500 when collection detail navigation fails", async () => {
      mockGetCollectionNavigationItem.mockRejectedValue(
        new Error("private collection detail nav")
      );

      const response = await GET_COLLECTION_NAVIGATION_DETAIL(
        request,
        createCollectionParams("paintings")
      );
      const body = await response.json();
      const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      expect(response.status).toBe(500);
      expect(response.headers.get(REQUEST_ID_HEADER)).toBe(requestId);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch collection navigation",
        error: "Failed to fetch collection navigation",
        requestId,
      });
      expect(logPayload).toEqual(
        expect.objectContaining({
          requestId,
          route: "/api/v2/public/navigation/collections/[slug]",
          method: "GET",
          errorLabel: "collection_navigation_detail_read_failed",
        })
      );
      expect(JSON.stringify(body)).not.toContain(
        "private collection detail nav"
      );
    });
  });

  describe("GET /api/v2/public/navigation/collections/[slug]/artworks", () => {
    it("returns the populated collection success shape", async () => {
      const rawCollection = {
        slug: "paintings",
        artworks: [{ slug: "blue-study" }],
      };
      const frontendCollection = {
        slug: "paintings",
        artworks: [{ slug: "blue-study", linkTo: "/artwork/blue-study" }],
      };
      const query = createPopulatedCollectionQuery(rawCollection);
      mockCollectionFindOne.mockReturnValue(query);
      mockTransformCollectionPopulated.mockReturnValue(
        frontendCollection as never
      );

      const response = await GET_COLLECTION_ARTWORKS_NAVIGATION(
        request,
        createCollectionParams("paintings")
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
        mockCollectionFindOne.mock.invocationCallOrder[0]
      );
      expect(mockCollectionFindOne).toHaveBeenCalledWith({ slug: "paintings" });
      expect(query.populate).toHaveBeenCalledWith("artworks");
      expect(body).toEqual({
        success: true,
        data: frontendCollection,
      });
    });

    it("returns 404 when the populated collection is missing", async () => {
      mockCollectionFindOne.mockReturnValue(
        createPopulatedCollectionQuery(null)
      );

      const response = await GET_COLLECTION_ARTWORKS_NAVIGATION(
        request,
        createCollectionParams("missing")
      );
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({
        success: false,
        message: "Collection not found",
        error: "Collection not found",
      });
      expect(mockTransformCollectionPopulated).not.toHaveBeenCalled();
    });

    it("returns a public-safe 500 when populated collection navigation fails", async () => {
      mockCollectionFindOne.mockReturnValue(
        createRejectedPopulatedCollectionQuery(
          new Error("private collection artwork nav")
        )
      );

      const response = await GET_COLLECTION_ARTWORKS_NAVIGATION(
        request,
        createCollectionParams("paintings")
      );
      const body = await response.json();
      const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      expect(response.status).toBe(500);
      expect(response.headers.get(REQUEST_ID_HEADER)).toBe(requestId);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch collection artworks navigation",
        error: "Failed to fetch collection artworks navigation",
        requestId,
      });
      expect(logPayload).toEqual(
        expect.objectContaining({
          requestId,
          route: "/api/v2/public/navigation/collections/[slug]/artworks",
          method: "GET",
          errorLabel: "collection_artworks_navigation_read_failed",
        })
      );
      expect(JSON.stringify(body)).not.toContain(
        "private collection artwork nav"
      );
    });
  });
});
