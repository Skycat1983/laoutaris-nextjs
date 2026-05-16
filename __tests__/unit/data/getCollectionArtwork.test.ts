jest.mock("server-only", () => ({}), { virtual: true });

import { CollectionModel } from "@/lib/data/models/collectionModel";
import { getCollectionArtwork } from "@/lib/data/services/getCollectionArtwork";
import dbConnect from "@/lib/db/mongodb";
import { Types } from "mongoose";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/collectionModel", () => ({
  CollectionModel: {
    findOne: jest.fn(),
  },
}));

jest.mock("mongoose", () => ({
  Types: {
    ObjectId: jest.fn((id: string) => ({ id })),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockCollectionFindOne = CollectionModel.findOne as jest.Mock;
const mockObjectId = Types.ObjectId as unknown as jest.Mock;

const createCollectionArtworkQuery = (result: unknown) => {
  const query = {
    populate: jest.fn().mockResolvedValue(result),
  };
  return query;
};

const createRejectedCollectionArtworkQuery = (error: unknown) => {
  const query = {
    populate: jest.fn().mockRejectedValue(error),
  };
  return query;
};

describe("getCollectionArtwork", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  it("populates only the matching artwork and returns the existing collection shape", async () => {
    const collectionData = {
      slug: "paintings",
      artworks: [{ _id: "64f1f77bcf86cd7994390111" }],
    };
    const collection = {
      toJSON: jest.fn(() => collectionData),
      artworks: collectionData.artworks,
    };
    const query = createCollectionArtworkQuery(collection);
    mockCollectionFindOne.mockReturnValue(query);

    await expect(
      getCollectionArtwork("paintings", "64f1f77bcf86cd7994390111")
    ).resolves.toEqual({
      status: "found",
      collection: collectionData,
    });

    expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
      mockCollectionFindOne.mock.invocationCallOrder[0]
    );
    expect(mockCollectionFindOne).toHaveBeenCalledWith({ slug: "paintings" });
    expect(mockObjectId).toHaveBeenCalledWith("64f1f77bcf86cd7994390111");
    expect(query.populate).toHaveBeenCalledWith({
      path: "artworks",
      match: { _id: { id: "64f1f77bcf86cd7994390111" } },
    });
    expect(collection.toJSON).toHaveBeenCalledTimes(1);
  });

  it("distinguishes a missing collection", async () => {
    const query = createCollectionArtworkQuery(null);
    mockCollectionFindOne.mockReturnValue(query);

    await expect(
      getCollectionArtwork("missing", "64f1f77bcf86cd7994390111")
    ).resolves.toEqual({
      status: "collection-not-found",
      collection: null,
    });
  });

  it("distinguishes an artwork that is not in the collection", async () => {
    const query = createCollectionArtworkQuery({
      slug: "paintings",
      artworks: [],
    });
    mockCollectionFindOne.mockReturnValue(query);

    await expect(
      getCollectionArtwork("paintings", "64f1f77bcf86cd7994390111")
    ).resolves.toEqual({
      status: "artwork-not-found",
      collection: null,
    });
  });

  it("rejects when collection artwork persistence fails", async () => {
    const error = new Error("private collection artwork");
    mockCollectionFindOne.mockReturnValue(
      createRejectedCollectionArtworkQuery(error)
    );

    await expect(
      getCollectionArtwork("paintings", "64f1f77bcf86cd7994390111")
    ).rejects.toThrow(error);
  });
});
