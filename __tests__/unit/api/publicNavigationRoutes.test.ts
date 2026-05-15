import { GET as GET_ARTICLE_NAVIGATION } from "@/app/api/v2/public/navigation/articles/[section]/route";
import { GET as GET_COLLECTION_NAVIGATION_LIST } from "@/app/api/v2/public/navigation/collections/route";
import { GET as GET_COLLECTION_NAVIGATION_DETAIL } from "@/app/api/v2/public/navigation/collections/[slug]/route";
import { GET as GET_COLLECTION_ARTWORKS_NAVIGATION } from "@/app/api/v2/public/navigation/collections/[slug]/artworks/route";
import { ArticleModel, CollectionModel } from "@/lib/data/models";
import dbConnect from "@/lib/db/mongodb";
import {
  transformBiographyNav,
  transformCollectionNav,
} from "@/lib/transforms/navigation/transformNavData";
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
  ArticleModel: {
    find: jest.fn(),
  },
  CollectionModel: {
    find: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock("@/lib/transforms/navigation/transformNavData", () => ({
  transformBiographyNav: {
    toFrontend: jest.fn(),
  },
  transformCollectionNav: {
    toFrontend: jest.fn(),
  },
}));

jest.mock("@/lib/transforms", () => ({
  transformCollectionPopulated: jest.fn(),
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockArticleFind = ArticleModel.find as jest.Mock;
const mockCollectionFind = CollectionModel.find as jest.Mock;
const mockCollectionFindOne = CollectionModel.findOne as jest.Mock;
const mockTransformBiographyNavToFrontend =
  transformBiographyNav.toFrontend as jest.Mock;
const mockTransformCollectionNavToFrontend =
  transformCollectionNav.toFrontend as jest.Mock;
const mockTransformCollectionPopulated =
  transformCollectionPopulated as jest.MockedFunction<
    typeof transformCollectionPopulated
  >;

const request = {} as never;

const createArticleParams = (section = "biography") => ({
  params: { section },
});

const createCollectionParams = (slug: string) => ({
  params: { slug },
});

const createArticleFindQuery = (result: unknown) => {
  const query = {
    select: jest.fn(),
    sort: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.select.mockReturnValue(query);
  query.sort.mockReturnValue(query);
  return query;
};

const createRejectedArticleFindQuery = (error: unknown) => {
  const query = {
    select: jest.fn(),
    sort: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.select.mockReturnValue(query);
  query.sort.mockReturnValue(query);
  return query;
};

const createCollectionListQuery = (result: unknown) => {
  const query = {
    select: jest.fn(),
    sort: jest.fn(),
    lean: jest.fn(),
    maxTimeMS: jest.fn().mockResolvedValue(result),
  };
  query.select.mockReturnValue(query);
  query.sort.mockReturnValue(query);
  query.lean.mockReturnValue(query);
  return query;
};

const createRejectedCollectionListQuery = (error: unknown) => {
  const query = {
    select: jest.fn(),
    sort: jest.fn(),
    lean: jest.fn(),
    maxTimeMS: jest.fn().mockRejectedValue(error),
  };
  query.select.mockReturnValue(query);
  query.sort.mockReturnValue(query);
  query.lean.mockReturnValue(query);
  return query;
};

const createCollectionNavDetailQuery = (result: unknown) => {
  const query = {
    select: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.select.mockReturnValue(query);
  return query;
};

const createRejectedCollectionNavDetailQuery = (error: unknown) => {
  const query = {
    select: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.select.mockReturnValue(query);
  return query;
};

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
      const rawArticles = [
        { slug: "early-life", title: "Early Life" },
        { slug: "studio-years", title: "Studio Years" },
      ];
      const navItems = [
        { slug: "early-life", title: "Early Life", linkTo: "/early-life" },
        { slug: "studio-years", title: "Studio Years", linkTo: "/studio" },
      ];
      const query = createArticleFindQuery(rawArticles);
      mockArticleFind.mockReturnValue(query);
      mockTransformBiographyNavToFrontend
        .mockReturnValueOnce(navItems[0])
        .mockReturnValueOnce(navItems[1]);

      const response = await GET_ARTICLE_NAVIGATION(
        request,
        createArticleParams("biography") as never
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
        mockArticleFind.mock.invocationCallOrder[0]
      );
      expect(mockArticleFind).toHaveBeenCalledWith({ section: "biography" });
      expect(query.select).toHaveBeenCalledWith("title slug");
      expect(query.sort).toHaveBeenCalledWith({ displayDate: -1 });
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
      mockArticleFind.mockReturnValue(createArticleFindQuery([]));

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
      expect(mockTransformBiographyNavToFrontend).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("returns a public-safe 500 when article navigation fails", async () => {
      mockArticleFind.mockReturnValue(
        createRejectedArticleFindQuery(new Error("private article nav"))
      );

      const response = await GET_ARTICLE_NAVIGATION(
        request,
        createArticleParams("biography") as never
      );
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch article navigation",
        error: "Failed to fetch article navigation",
      });
      expect(JSON.stringify(body)).not.toContain("private article nav");
    });
  });

  describe("GET /api/v2/public/navigation/collections", () => {
    it("returns collection navigation with existing metadata", async () => {
      const rawCollections = [
        { slug: "paintings", title: "Paintings" },
        { slug: "drawings", title: "Drawings" },
      ];
      const navItems = [
        { slug: "paintings", title: "Paintings", linkTo: "/paintings" },
        { slug: "drawings", title: "Drawings", linkTo: "/drawings" },
      ];
      const query = createCollectionListQuery(rawCollections);
      mockCollectionFind.mockReturnValue(query);
      mockTransformCollectionNavToFrontend
        .mockReturnValueOnce(navItems[0])
        .mockReturnValueOnce(navItems[1]);

      const response = await GET_COLLECTION_NAVIGATION_LIST(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
        mockCollectionFind.mock.invocationCallOrder[0]
      );
      expect(mockCollectionFind).toHaveBeenCalledWith({
        section: "collections",
      });
      expect(query.select).toHaveBeenCalledWith("title slug artworks");
      expect(query.sort).toHaveBeenCalledWith({ updatedAt: 1 });
      expect(query.maxTimeMS).toHaveBeenCalledWith(30000);
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
      mockCollectionFind.mockReturnValue(createCollectionListQuery([]));

      const response = await GET_COLLECTION_NAVIGATION_LIST(request);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({
        success: false,
        message: "No collections found",
        error: "No collections found",
      });
      expect(mockTransformCollectionNavToFrontend).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("returns a public-safe 500 when collection navigation fails", async () => {
      mockCollectionFind.mockReturnValue(
        createRejectedCollectionListQuery(new Error("private collection nav"))
      );

      const response = await GET_COLLECTION_NAVIGATION_LIST(request);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch collection navigation",
        error: "Failed to fetch collection navigation",
      });
      expect(JSON.stringify(body)).not.toContain("private collection nav");
    });
  });

  describe("GET /api/v2/public/navigation/collections/[slug]", () => {
    it("returns a single collection navigation item", async () => {
      const rawCollection = { slug: "paintings", title: "Paintings" };
      const navItem = {
        slug: "paintings",
        title: "Paintings",
        linkTo: "/paintings",
      };
      const query = createCollectionNavDetailQuery(rawCollection);
      mockCollectionFindOne.mockReturnValue(query);
      mockTransformCollectionNavToFrontend.mockReturnValue(navItem);

      const response = await GET_COLLECTION_NAVIGATION_DETAIL(
        request,
        createCollectionParams("paintings")
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
        mockCollectionFindOne.mock.invocationCallOrder[0]
      );
      expect(mockCollectionFindOne).toHaveBeenCalledWith({
        section: "collections",
        slug: "paintings",
      });
      expect(query.select).toHaveBeenCalledWith("title slug artworks");
      expect(body).toEqual({
        success: true,
        data: navItem,
      });
    });

    it("returns 404 when the collection navigation target is missing", async () => {
      mockCollectionFindOne.mockReturnValue(
        createCollectionNavDetailQuery(null)
      );

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
      expect(mockTransformCollectionNavToFrontend).not.toHaveBeenCalled();
    });

    it("returns a public-safe 500 when collection detail navigation fails", async () => {
      mockCollectionFindOne.mockReturnValue(
        createRejectedCollectionNavDetailQuery(
          new Error("private collection detail nav")
        )
      );

      const response = await GET_COLLECTION_NAVIGATION_DETAIL(
        request,
        createCollectionParams("paintings")
      );
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch collection navigation",
        error: "Failed to fetch collection navigation",
      });
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

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch collection artworks navigation",
        error: "Failed to fetch collection artworks navigation",
      });
      expect(JSON.stringify(body)).not.toContain(
        "private collection artwork nav"
      );
    });
  });
});
