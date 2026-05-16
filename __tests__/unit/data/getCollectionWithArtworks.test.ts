jest.mock("server-only", () => ({}), { virtual: true });

import { CollectionModel } from "@/lib/data/models/collectionModel";
import { getCollectionWithArtworks } from "@/lib/data/services/getCollectionWithArtworks";
import dbConnect from "@/lib/db/mongodb";
import { transformCollectionPopulated } from "@/lib/transforms";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/collectionModel", () => ({
  CollectionModel: {
    findOne: jest.fn(),
  },
}));

jest.mock("@/lib/transforms", () => ({
  transformCollectionPopulated: jest.fn(),
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockCollectionFindOne = CollectionModel.findOne as jest.Mock;
const mockTransformCollectionPopulated =
  transformCollectionPopulated as jest.MockedFunction<
    typeof transformCollectionPopulated
  >;

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

describe("getCollectionWithArtworks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  it("uses MongoDB ownership, artwork population, lean typing, and transform", async () => {
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

    await expect(getCollectionWithArtworks("paintings")).resolves.toBe(
      frontendCollection
    );

    expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
      mockCollectionFindOne.mock.invocationCallOrder[0]
    );
    expect(mockCollectionFindOne).toHaveBeenCalledWith({ slug: "paintings" });
    expect(query.populate).toHaveBeenCalledWith("artworks");
    expect(mockTransformCollectionPopulated).toHaveBeenCalledWith(
      rawCollection
    );
  });

  it("returns null when the collection does not exist", async () => {
    mockCollectionFindOne.mockReturnValue(createPopulatedCollectionQuery(null));

    await expect(getCollectionWithArtworks("missing")).resolves.toBeNull();

    expect(mockTransformCollectionPopulated).not.toHaveBeenCalled();
  });

  it("rejects when populated collection persistence fails", async () => {
    const error = new Error("private populated collection");
    mockCollectionFindOne.mockReturnValue(
      createRejectedPopulatedCollectionQuery(error)
    );

    await expect(getCollectionWithArtworks("paintings")).rejects.toThrow(error);

    expect(mockTransformCollectionPopulated).not.toHaveBeenCalled();
  });
});
