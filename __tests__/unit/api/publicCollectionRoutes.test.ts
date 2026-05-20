jest.mock("server-only", () => ({}), { virtual: true });

import { GET as GET_COLLECTION_LIST } from "@/app/api/v2/public/collection/route";
import { GET as GET_COLLECTION_DETAIL } from "@/app/api/v2/public/collection/[slug]/route";
import { GET as GET_COLLECTION_ARTWORK_LIST } from "@/app/api/v2/public/collection/[slug]/artwork/route";
import { GET as GET_COLLECTION_ARTWORK_DETAIL } from "@/app/api/v2/public/collection/[slug]/artwork/[id]/route";
import { CollectionModel } from "@/lib/data/models";
import { getCollectionArtwork } from "@/lib/data/services/getCollectionArtwork";
import { getCollectionList } from "@/lib/data/services/getCollectionList";
import { getCollectionWithArtworks } from "@/lib/data/services/getCollectionWithArtworks";
import { REQUEST_ID_HEADER } from "@/lib/observability/requestContext";
import dbConnect from "@/lib/db/mongodb";

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
    findOne: jest.fn(),
  },
}));

jest.mock("@/lib/data/services/getCollectionWithArtworks", () => ({
  getCollectionWithArtworks: jest.fn(),
}));

jest.mock("@/lib/data/services/getCollectionArtwork", () => ({
  getCollectionArtwork: jest.fn(),
}));

jest.mock("@/lib/data/services/getCollectionList", () => ({
  getCollectionList: jest.fn(),
}));

jest.mock("mongoose", () => ({
  Types: {
    ObjectId: jest.fn((id: string) => ({ id })),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockCollectionFindOne = CollectionModel.findOne as jest.Mock;
const mockGetCollectionWithArtworks =
  getCollectionWithArtworks as jest.MockedFunction<
    typeof getCollectionWithArtworks
  >;
const mockGetCollectionArtwork = getCollectionArtwork as jest.MockedFunction<
  typeof getCollectionArtwork
>;
const mockGetCollectionList = getCollectionList as jest.MockedFunction<
  typeof getCollectionList
>;

const propagatedRequestId = "req-collection-detail";

const requestWithSearch = (url: string, requestId?: string) =>
  ({
    method: "GET",
    headers: new Headers(
      requestId === undefined ? {} : { "x-request-id": requestId }
    ),
    nextUrl: new URL(url),
    url,
  }) as never;

const request = requestWithSearch(
  "https://example.test/api/v2/public/collection"
);

const createParams = (slug: string) => ({
  params: { slug },
});

const createArtworkParams = (slug: string, id = "64f1f77bcf86cd7994390111") => ({
  params: { slug, id },
});

describe("public collection routes", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("GET /api/v2/public/collection", () => {
    it("returns a list success envelope with existing metadata from the collection list service", async () => {
      const frontendCollections = [
        { slug: "paintings", title: "Paintings", linkTo: "/paintings" },
        { slug: "drawings", title: "Drawings", linkTo: "/drawings" },
      ];
      mockGetCollectionList.mockResolvedValue({
        success: true,
        data: frontendCollections,
        metadata: {
          page: 2,
          limit: 5,
          total: 12,
          totalPages: 3,
        },
      } as never);

      const response = await GET_COLLECTION_LIST(
        requestWithSearch(
          "https://example.test/api/v2/public/collection?section=collections&page=2&limit=5"
        )
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockGetCollectionList).toHaveBeenCalledWith({
        section: "collections",
        page: 2,
        limit: 5,
      });
      expect(body).toEqual({
        success: true,
        data: frontendCollections,
        metadata: {
          page: 2,
          limit: 5,
          total: 12,
          totalPages: 3,
        },
      });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("rejects invalid sections before calling the collection list service", async () => {
      const response = await GET_COLLECTION_LIST(
        requestWithSearch(
          "https://example.test/api/v2/public/collection?section=archive"
        )
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(mockGetCollectionList).not.toHaveBeenCalled();
      expect(body).toEqual({
        success: false,
        error: "Invalid collection query",
        fieldErrors: {
          section: expect.arrayContaining([expect.any(String)]),
        },
        formErrors: [],
      });
    });

    it("preserves default list params when query values are omitted", async () => {
      mockGetCollectionList.mockResolvedValue({
        success: true,
        data: [],
        metadata: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      } as never);

      const response = await GET_COLLECTION_LIST(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockGetCollectionList).toHaveBeenCalledWith({
        section: null,
        page: 1,
        limit: 10,
      });
      expect(body).toEqual({
        success: true,
        data: [],
        metadata: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      });
    });

    it("preserves the missing-list response body", async () => {
      mockGetCollectionList.mockResolvedValue(null);

      const response = await GET_COLLECTION_LIST(request);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({
        success: false,
        message: "No collections found",
        error: "No collections found",
      });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("returns a public-safe 500 when list lookup fails", async () => {
      mockGetCollectionList.mockRejectedValue(
        new Error("private collection list")
      );

      const response = await GET_COLLECTION_LIST(request);
      const body = await response.json();
      const generatedRequestId = response.headers.get(REQUEST_ID_HEADER);
      const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      expect(response.status).toBe(500);
      expect(generatedRequestId).toMatch(/^[0-9a-f-]{36}$/);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch collections",
        error: "Failed to fetch collections",
        requestId: generatedRequestId,
      });
      expect(logPayload).toEqual(
        expect.objectContaining({
          requestId: generatedRequestId,
          route: "/api/v2/public/collection",
          method: "GET",
          errorLabel: "collection_list_read_failed",
        })
      );
      expect(JSON.stringify(body)).not.toContain("private collection list");
    });
  });

  describe("GET /api/v2/public/collection/[slug]", () => {
    it("returns a success envelope for an existing collection", async () => {
      const collection = { slug: "paintings", title: "Paintings" };
      mockCollectionFindOne.mockResolvedValue(collection);

      const response = await GET_COLLECTION_DETAIL(
        request,
        createParams("paintings")
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
        mockCollectionFindOne.mock.invocationCallOrder[0]
      );
      expect(mockCollectionFindOne).toHaveBeenCalledWith({ slug: "paintings" });
      expect(body).toEqual({
        success: true,
        data: collection,
      });
    });

    it("returns 404 when the collection does not exist", async () => {
      mockCollectionFindOne.mockResolvedValue(null);

      const response = await GET_COLLECTION_DETAIL(
        request,
        createParams("missing")
      );
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({
        success: false,
        message: "Collection not found",
        error: "Collection not found",
      });
    });

    it("returns a public-safe 500 when detail lookup fails", async () => {
      mockCollectionFindOne.mockRejectedValue(
        new Error("private collection detail")
      );

      const response = await GET_COLLECTION_DETAIL(
        requestWithSearch(
          "https://example.test/api/v2/public/collection/paintings",
          propagatedRequestId
        ),
        createParams("paintings")
      );
      const body = await response.json();
      const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      expect(response.status).toBe(500);
      expect(response.headers.get(REQUEST_ID_HEADER)).toBe(propagatedRequestId);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch collection",
        error: "Failed to fetch collection",
        requestId: propagatedRequestId,
      });
      expect(logPayload).toEqual(
        expect.objectContaining({
          requestId: propagatedRequestId,
          route: "/api/v2/public/collection/[slug]",
          method: "GET",
          errorLabel: "collection_detail_read_failed",
        })
      );
      expect(JSON.stringify(body)).not.toContain("private collection detail");
    });
  });

  describe("GET /api/v2/public/collection/[slug]/artwork", () => {
    it("returns a success envelope for a populated collection", async () => {
      const frontendCollection = {
        slug: "paintings",
        artworks: [{ slug: "blue-study", linkTo: "/artwork/blue-study" }],
      };
      mockGetCollectionWithArtworks.mockResolvedValue(
        frontendCollection as never
      );

      const response = await GET_COLLECTION_ARTWORK_LIST(
        request,
        createParams("paintings")
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockGetCollectionWithArtworks).toHaveBeenCalledWith("paintings");
      expect(body).toEqual({
        success: true,
        data: frontendCollection,
      });
    });

    it("returns 404 when the populated collection does not exist", async () => {
      mockGetCollectionWithArtworks.mockResolvedValue(null);

      const response = await GET_COLLECTION_ARTWORK_LIST(
        request,
        createParams("missing")
      );
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({
        success: false,
        message: "Collection not found",
        error: "Collection not found",
      });
      expect(mockGetCollectionWithArtworks).toHaveBeenCalledWith("missing");
    });

    it("returns a public-safe 500 when populated lookup fails", async () => {
      mockGetCollectionWithArtworks.mockRejectedValue(
        new Error("private populated list")
      );

      const response = await GET_COLLECTION_ARTWORK_LIST(
        request,
        createParams("paintings")
      );
      const body = await response.json();
      const generatedRequestId = response.headers.get(REQUEST_ID_HEADER);

      expect(response.status).toBe(500);
      expect(generatedRequestId).toMatch(/^[0-9a-f-]{36}$/);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch collection with artworks",
        error: "Failed to fetch collection with artworks",
        requestId: generatedRequestId,
      });
      expect(JSON.stringify(body)).not.toContain("private populated list");
    });
  });

  describe("GET /api/v2/public/collection/[slug]/artwork/[id]", () => {
    it("returns 404 when the collection does not exist", async () => {
      mockGetCollectionArtwork.mockResolvedValue({
        status: "collection-not-found",
        collection: null,
      });

      const response = await GET_COLLECTION_ARTWORK_DETAIL(
        request,
        createArtworkParams("missing")
      );
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({
        success: false,
        message: "Collection not found",
        error: "Collection not found",
      });
      expect(mockGetCollectionArtwork).toHaveBeenCalledWith(
        "missing",
        "64f1f77bcf86cd7994390111"
      );
    });

    it("returns 404 when the artwork is not in the collection", async () => {
      mockGetCollectionArtwork.mockResolvedValue({
        status: "artwork-not-found",
        collection: null,
      });

      const response = await GET_COLLECTION_ARTWORK_DETAIL(
        request,
        createArtworkParams("paintings")
      );
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({
        success: false,
        message: "Artwork not found in this collection",
        error: "Artwork not found in this collection",
      });
    });

    it("returns a success envelope for a matching artwork in a collection", async () => {
      const collection = {
        slug: "paintings",
        artworks: [{ _id: "64f1f77bcf86cd7994390111" }],
      };
      mockGetCollectionArtwork.mockResolvedValue({
        status: "found",
        collection: collection as never,
      });

      const response = await GET_COLLECTION_ARTWORK_DETAIL(
        request,
        createArtworkParams("paintings")
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockGetCollectionArtwork).toHaveBeenCalledWith(
        "paintings",
        "64f1f77bcf86cd7994390111"
      );
      expect(body).toEqual({
        success: true,
        data: collection,
      });
    });

    it("returns a public-safe 500 when artwork detail lookup fails", async () => {
      mockGetCollectionArtwork.mockRejectedValue(
        new Error("private artwork detail")
      );

      const response = await GET_COLLECTION_ARTWORK_DETAIL(
        request,
        createArtworkParams("paintings")
      );
      const body = await response.json();
      const generatedRequestId = response.headers.get(REQUEST_ID_HEADER);

      expect(response.status).toBe(500);
      expect(generatedRequestId).toMatch(/^[0-9a-f-]{36}$/);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch collection artwork",
        error: "Failed to fetch collection artwork",
        requestId: generatedRequestId,
      });
      expect(JSON.stringify(body)).not.toContain("private artwork detail");
    });
  });
});
