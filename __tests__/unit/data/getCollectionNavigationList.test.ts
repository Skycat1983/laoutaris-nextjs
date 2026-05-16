jest.mock("server-only", () => ({}), { virtual: true });

import { CollectionModel } from "@/lib/data/models/collectionModel";
import { getCollectionNavigationList } from "@/lib/data/services/getCollectionNavigationList";
import dbConnect from "@/lib/db/mongodb";
import { transformCollectionNav } from "@/lib/transforms/navigation/transformNavData";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/collectionModel", () => ({
  CollectionModel: {
    find: jest.fn(),
  },
}));

jest.mock("@/lib/transforms/navigation/transformNavData", () => ({
  transformCollectionNav: {
    toFrontend: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockCollectionFind = CollectionModel.find as jest.Mock;
const mockTransformCollectionNavToFrontend =
  transformCollectionNav.toFrontend as jest.Mock;

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

describe("getCollectionNavigationList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  it("uses MongoDB ownership, selection, ordering, transforms, and metadata", async () => {
    const rawCollections = [
      { slug: "paintings", title: "Paintings" },
      { slug: "drawings", title: "Drawings" },
    ];
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
    const query = createCollectionListQuery(rawCollections);
    mockCollectionFind.mockReturnValue(query);
    mockTransformCollectionNavToFrontend
      .mockReturnValueOnce(navItems[0])
      .mockReturnValueOnce(navItems[1]);

    await expect(getCollectionNavigationList()).resolves.toEqual({
      success: true,
      data: navItems,
      metadata: {
        total: 2,
        page: 1,
        limit: 2,
        totalPages: 1,
      },
    });

    expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
      mockCollectionFind.mock.invocationCallOrder[0]
    );
    expect(mockCollectionFind).toHaveBeenCalledWith({
      section: "collections",
    });
    expect(query.select).toHaveBeenCalledWith("title slug artworks");
    expect(query.sort).toHaveBeenCalledWith({ updatedAt: 1 });
    expect(query.maxTimeMS).toHaveBeenCalledWith(30000);
    expect(mockTransformCollectionNavToFrontend).toHaveBeenNthCalledWith(
      1,
      rawCollections[0]
    );
    expect(mockTransformCollectionNavToFrontend).toHaveBeenNthCalledWith(
      2,
      rawCollections[1]
    );
  });

  it("returns null when no collection navigation items exist", async () => {
    mockCollectionFind.mockReturnValue(createCollectionListQuery([]));

    await expect(getCollectionNavigationList()).resolves.toBeNull();

    expect(mockTransformCollectionNavToFrontend).not.toHaveBeenCalled();
  });

  it("rejects when collection navigation persistence fails", async () => {
    const error = new Error("private collection nav");
    mockCollectionFind.mockReturnValue(createRejectedCollectionListQuery(error));

    await expect(getCollectionNavigationList()).rejects.toThrow(error);

    expect(mockTransformCollectionNavToFrontend).not.toHaveBeenCalled();
  });
});
