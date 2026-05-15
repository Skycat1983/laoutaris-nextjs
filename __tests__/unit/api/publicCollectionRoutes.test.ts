import { GET as GET_COLLECTION_LIST } from "@/app/api/v2/public/collection/route";
import { GET as GET_COLLECTION_DETAIL } from "@/app/api/v2/public/collection/[slug]/route";
import { GET as GET_COLLECTION_ARTWORK_LIST } from "@/app/api/v2/public/collection/[slug]/artwork/route";
import { GET as GET_COLLECTION_ARTWORK_DETAIL } from "@/app/api/v2/public/collection/[slug]/artwork/[id]/route";
import { CollectionModel } from "@/lib/data/models";
import dbConnect from "@/lib/db/mongodb";
import { transformCollection } from "@/lib/transforms/collection/transformCollection";
import { transformCollectionPopulated } from "@/lib/transforms";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: { status?: number }) => ({
      status: init?.status ?? 200,
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
    countDocuments: jest.fn(),
  },
}));

jest.mock("@/lib/transforms/collection/transformCollection", () => ({
  transformCollection: {
    toFrontend: jest.fn(),
  },
}));

jest.mock("@/lib/transforms", () => ({
  transformCollectionPopulated: jest.fn(),
}));

jest.mock("mongoose", () => ({
  Types: {
    ObjectId: jest.fn((id: string) => ({ id })),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockCollectionFind = CollectionModel.find as jest.Mock;
const mockCollectionFindOne = CollectionModel.findOne as jest.Mock;
const mockCountDocuments = CollectionModel.countDocuments as jest.Mock;
const mockTransformCollectionToFrontend =
  transformCollection.toFrontend as jest.Mock;
const mockTransformCollectionPopulated =
  transformCollectionPopulated as jest.MockedFunction<
    typeof transformCollectionPopulated
  >;

const request = {
  nextUrl: new URL("https://example.test/api/v2/public/collection"),
} as never;

const requestWithSearch = (url: string) =>
  ({
    nextUrl: new URL(url),
  }) as never;

const createParams = (slug: string) => ({
  params: { slug },
});

const createArtworkParams = (slug: string, id = "64f1f77bcf86cd7994390111") => ({
  params: { slug, id },
});

const createFindQuery = (result: unknown) => {
  const query = {
    skip: jest.fn(),
    limit: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.skip.mockReturnValue(query);
  query.limit.mockReturnValue(query);
  return query;
};

const createRejectedFindQuery = (error: unknown) => {
  const query = {
    skip: jest.fn(),
    limit: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.skip.mockReturnValue(query);
  query.limit.mockReturnValue(query);
  return query;
};

const createPopulatedLeanQuery = (result: unknown) => {
  const query = {
    populate: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.populate.mockReturnValue(query);
  return query;
};

const createRejectedPopulatedLeanQuery = (error: unknown) => {
  const query = {
    populate: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.populate.mockReturnValue(query);
  return query;
};

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
    it("returns a list success envelope with existing metadata", async () => {
      const rawCollections = [
        { slug: "paintings", title: "Paintings" },
        { slug: "drawings", title: "Drawings" },
      ];
      const frontendCollections = [
        { slug: "paintings", title: "Paintings", linkTo: "/paintings" },
        { slug: "drawings", title: "Drawings", linkTo: "/drawings" },
      ];
      const query = createFindQuery(rawCollections);
      mockCollectionFind.mockReturnValue(query);
      mockCountDocuments.mockResolvedValue(12);
      mockTransformCollectionToFrontend
        .mockReturnValueOnce(frontendCollections[0])
        .mockReturnValueOnce(frontendCollections[1]);

      const response = await GET_COLLECTION_LIST(
        requestWithSearch(
          "https://example.test/api/v2/public/collection?section=archive&page=2&limit=5"
        )
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockDbConnect).toHaveBeenCalledTimes(1);
      expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
        mockCollectionFind.mock.invocationCallOrder[0]
      );
      expect(mockCollectionFind).toHaveBeenCalledWith({ section: "archive" });
      expect(query.skip).toHaveBeenCalledWith(5);
      expect(query.limit).toHaveBeenCalledWith(5);
      expect(mockCountDocuments).toHaveBeenCalledWith({ section: "archive" });
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

    it("returns a public-safe 500 when list lookup fails", async () => {
      mockCollectionFind.mockReturnValue(
        createRejectedFindQuery(new Error("private collection list"))
      );
      mockCountDocuments.mockResolvedValue(0);

      const response = await GET_COLLECTION_LIST(request);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch collections",
        error: "Failed to fetch collections",
      });
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
        request,
        createParams("paintings")
      );
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch collection",
        error: "Failed to fetch collection",
      });
      expect(JSON.stringify(body)).not.toContain("private collection detail");
    });
  });

  describe("GET /api/v2/public/collection/[slug]/artwork", () => {
    it("returns a success envelope for a populated collection", async () => {
      const rawCollection = {
        slug: "paintings",
        artworks: [{ slug: "blue-study" }],
      };
      const frontendCollection = {
        slug: "paintings",
        artworks: [{ slug: "blue-study", linkTo: "/artwork/blue-study" }],
      };
      const query = createPopulatedLeanQuery(rawCollection);
      mockCollectionFindOne.mockReturnValue(query);
      mockTransformCollectionPopulated.mockReturnValue(
        frontendCollection as never
      );

      const response = await GET_COLLECTION_ARTWORK_LIST(
        request,
        createParams("paintings")
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
        mockCollectionFindOne.mock.invocationCallOrder[0]
      );
      expect(mockCollectionFindOne).toHaveBeenCalledWith({ slug: "paintings" });
      expect(query.populate).toHaveBeenCalledWith("artworks");
      expect(mockTransformCollectionPopulated).toHaveBeenCalledWith(
        rawCollection
      );
      expect(body).toEqual({
        success: true,
        data: frontendCollection,
      });
    });

    it("returns 404 when the populated collection does not exist", async () => {
      mockCollectionFindOne.mockReturnValue(createPopulatedLeanQuery(null));

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
      expect(mockTransformCollectionPopulated).not.toHaveBeenCalled();
    });

    it("returns a public-safe 500 when populated lookup fails", async () => {
      mockCollectionFindOne.mockReturnValue(
        createRejectedPopulatedLeanQuery(new Error("private populated list"))
      );

      const response = await GET_COLLECTION_ARTWORK_LIST(
        request,
        createParams("paintings")
      );
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch collection with artworks",
        error: "Failed to fetch collection with artworks",
      });
      expect(JSON.stringify(body)).not.toContain("private populated list");
    });
  });

  describe("GET /api/v2/public/collection/[slug]/artwork/[id]", () => {
    it("returns 404 when the collection does not exist", async () => {
      const query = {
        populate: jest.fn().mockResolvedValue(null),
      };
      mockCollectionFindOne.mockReturnValue(query);

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
    });

    it("returns 404 when the artwork is not in the collection", async () => {
      const query = {
        populate: jest.fn().mockResolvedValue({
          slug: "paintings",
          artworks: [],
        }),
      };
      mockCollectionFindOne.mockReturnValue(query);

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
      const query = {
        populate: jest.fn().mockResolvedValue(collection),
      };
      mockCollectionFindOne.mockReturnValue(query);

      const response = await GET_COLLECTION_ARTWORK_DETAIL(
        request,
        createArtworkParams("paintings")
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
        mockCollectionFindOne.mock.invocationCallOrder[0]
      );
      expect(mockCollectionFindOne).toHaveBeenCalledWith({ slug: "paintings" });
      expect(query.populate).toHaveBeenCalledWith({
        path: "artworks",
        match: { _id: expect.any(Object) },
      });
      expect(body).toEqual({
        success: true,
        data: collection,
      });
    });

    it("returns a public-safe 500 when artwork detail lookup fails", async () => {
      const query = {
        populate: jest
          .fn()
          .mockRejectedValue(new Error("private artwork detail")),
      };
      mockCollectionFindOne.mockReturnValue(query);

      const response = await GET_COLLECTION_ARTWORK_DETAIL(
        request,
        createArtworkParams("paintings")
      );
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch collection artwork",
        error: "Failed to fetch collection artwork",
      });
      expect(JSON.stringify(body)).not.toContain("private artwork detail");
    });
  });
});
