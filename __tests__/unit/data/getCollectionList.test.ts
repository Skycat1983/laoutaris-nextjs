jest.mock("server-only", () => ({}), { virtual: true });

import { CollectionModel } from "@/lib/data/models/collectionModel";
import { getCollectionList } from "@/lib/data/services/getCollectionList";
import dbConnect from "@/lib/db/mongodb";
import { transformCollection } from "@/lib/transforms/collection/transformCollection";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/collectionModel", () => ({
  CollectionModel: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

jest.mock("@/lib/transforms/collection/transformCollection", () => ({
  transformCollection: {
    toFrontend: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockCollectionFind = CollectionModel.find as jest.Mock;
const mockCollectionCountDocuments =
  CollectionModel.countDocuments as jest.Mock;
const mockTransformCollectionToFrontend =
  transformCollection.toFrontend as jest.Mock;

const createCollectionListQuery = (result: unknown) => {
  const query = {
    skip: jest.fn(),
    limit: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.skip.mockReturnValue(query);
  query.limit.mockReturnValue(query);
  return query;
};

const createRejectedCollectionListQuery = (error: unknown) => {
  const query = {
    skip: jest.fn(),
    limit: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.skip.mockReturnValue(query);
  query.limit.mockReturnValue(query);
  return query;
};

describe("getCollectionList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    mockCollectionCountDocuments.mockResolvedValue(12);
    mockTransformCollectionToFrontend.mockImplementation((collection) => ({
      slug: collection.slug,
      title: collection.title,
      linkTo: `/collections/${collection.slug}`,
    }));
  });

  it("uses MongoDB ownership, optional section filtering, pagination, transforms, and metadata", async () => {
    const rawCollections = [
      { slug: "paintings", title: "Paintings" },
      { slug: "drawings", title: "Drawings" },
    ];
    const query = createCollectionListQuery(rawCollections);
    mockCollectionFind.mockReturnValue(query);

    await expect(
      getCollectionList({
        section: "collections",
        page: 2,
        limit: 5,
      })
    ).resolves.toEqual({
      success: true,
      data: [
        {
          slug: "paintings",
          title: "Paintings",
          linkTo: "/collections/paintings",
        },
        {
          slug: "drawings",
          title: "Drawings",
          linkTo: "/collections/drawings",
        },
      ],
      metadata: {
        page: 2,
        limit: 5,
        total: 12,
        totalPages: 3,
      },
    });

    expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
      mockCollectionFind.mock.invocationCallOrder[0]
    );
    expect(mockCollectionFind).toHaveBeenCalledWith({
      section: "collections",
    });
    expect(mockCollectionCountDocuments).toHaveBeenCalledWith({
      section: "collections",
    });
    expect(query.skip).toHaveBeenCalledWith(5);
    expect(query.limit).toHaveBeenCalledWith(5);
    expect(mockTransformCollectionToFrontend).toHaveBeenNthCalledWith(
      1,
      rawCollections[0]
    );
    expect(mockTransformCollectionToFrontend).toHaveBeenNthCalledWith(
      2,
      rawCollections[1]
    );
  });

  it("preserves default list params and empty-list success semantics when filters are omitted", async () => {
    const query = createCollectionListQuery([]);
    mockCollectionFind.mockReturnValue(query);
    mockCollectionCountDocuments.mockResolvedValue(0);

    await expect(getCollectionList()).resolves.toEqual({
      success: true,
      data: [],
      metadata: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    });

    expect(mockCollectionFind).toHaveBeenCalledWith({});
    expect(mockCollectionCountDocuments).toHaveBeenCalledWith({});
    expect(query.skip).toHaveBeenCalledWith(0);
    expect(query.limit).toHaveBeenCalledWith(10);
    expect(mockTransformCollectionToFrontend).not.toHaveBeenCalled();
  });

  it("returns null when the collection list result is missing", async () => {
    mockCollectionFind.mockReturnValue(createCollectionListQuery(null));
    mockCollectionCountDocuments.mockResolvedValue(0);

    await expect(
      getCollectionList({ section: "collections" })
    ).resolves.toBeNull();

    expect(mockTransformCollectionToFrontend).not.toHaveBeenCalled();
  });

  it("rejects when collection list persistence fails", async () => {
    const error = new Error("private collection list");
    mockCollectionFind.mockReturnValue(createRejectedCollectionListQuery(error));

    await expect(getCollectionList()).rejects.toThrow(error);

    expect(mockTransformCollectionToFrontend).not.toHaveBeenCalled();
  });
});
