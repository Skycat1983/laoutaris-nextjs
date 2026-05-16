jest.mock("server-only", () => ({}), { virtual: true });

import { CollectionModel } from "@/lib/data/models/collectionModel";
import { getCollectionNavigationItem } from "@/lib/data/services/getCollectionNavigationItem";
import dbConnect from "@/lib/db/mongodb";
import { transformCollectionNav } from "@/lib/transforms/navigation/transformNavData";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/collectionModel", () => ({
  CollectionModel: {
    findOne: jest.fn(),
  },
}));

jest.mock("@/lib/transforms/navigation/transformNavData", () => ({
  transformCollectionNav: {
    toFrontend: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockCollectionFindOne = CollectionModel.findOne as jest.Mock;
const mockTransformCollectionNavToFrontend =
  transformCollectionNav.toFrontend as jest.Mock;

const createCollectionItemQuery = (result: unknown) => {
  const query = {
    select: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.select.mockReturnValue(query);
  return query;
};

const createRejectedCollectionItemQuery = (error: unknown) => {
  const query = {
    select: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.select.mockReturnValue(query);
  return query;
};

describe("getCollectionNavigationItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  it("uses MongoDB ownership, selection, and transform for the requested collection", async () => {
    const rawCollection = { slug: "paintings", title: "Paintings" };
    const navItem = {
      slug: "paintings",
      title: "Paintings",
      firstArtworkId: "artwork-1",
      hasArtwork: true,
    };
    const query = createCollectionItemQuery(rawCollection);
    mockCollectionFindOne.mockReturnValue(query);
    mockTransformCollectionNavToFrontend.mockReturnValue(navItem);

    await expect(getCollectionNavigationItem("paintings")).resolves.toBe(
      navItem
    );

    expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
      mockCollectionFindOne.mock.invocationCallOrder[0]
    );
    expect(mockCollectionFindOne).toHaveBeenCalledWith({
      section: "collections",
      slug: "paintings",
    });
    expect(query.select).toHaveBeenCalledWith("title slug artworks");
    expect(mockTransformCollectionNavToFrontend).toHaveBeenCalledWith(
      rawCollection
    );
  });

  it("returns null when the collection navigation item is missing", async () => {
    mockCollectionFindOne.mockReturnValue(createCollectionItemQuery(null));

    await expect(getCollectionNavigationItem("missing")).resolves.toBeNull();

    expect(mockTransformCollectionNavToFrontend).not.toHaveBeenCalled();
  });

  it("rejects when collection navigation persistence fails", async () => {
    const error = new Error("private collection item nav");
    mockCollectionFindOne.mockReturnValue(
      createRejectedCollectionItemQuery(error)
    );

    await expect(getCollectionNavigationItem("paintings")).rejects.toThrow(
      error
    );

    expect(mockTransformCollectionNavToFrontend).not.toHaveBeenCalled();
  });
});
