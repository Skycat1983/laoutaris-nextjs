jest.mock("server-only", () => ({}), { virtual: true });

import dbConnect from "@/lib/db/mongodb";
import { ArtworkModel } from "@/lib/data/models/artworkModel";
import { getArtworkById, isValidArtworkId } from "@/lib/data/services/getArtworkById";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/artworkModel", () => ({
  ArtworkModel: {
    findById: jest.fn(),
  },
}));

jest.mock("@/lib/transforms/artwork/transformArtwork", () => ({
  transformArtwork: {
    toFrontend: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockFindById = ArtworkModel.findById as jest.Mock;
const mockToFrontend = transformArtwork.toFrontend as jest.Mock;

const validArtworkId = "507f1f77bcf86cd799439011";
const leanArtwork = {
  _id: validArtworkId,
  title: "Linked Artwork",
};
const frontendArtwork = {
  _id: validArtworkId,
  title: "Linked Artwork",
};

const mockLeanResult = (value: unknown) => {
  mockFindById.mockReturnValue({
    lean: jest.fn().mockResolvedValue(value),
  });
};

describe("getArtworkById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  it("validates strict MongoDB ObjectId shape", () => {
    expect(isValidArtworkId(validArtworkId)).toBe(true);
    expect(isValidArtworkId("not-an-object-id")).toBe(false);
    expect(isValidArtworkId("abcdefghijkl")).toBe(false);
    expect(isValidArtworkId("gid://shopify/Product/123")).toBe(false);
  });

  it.each(["", "not-an-object-id", "abcdefghijkl"])(
    "returns null for invalid artwork ID %p without touching MongoDB",
    async (artworkId) => {
      await expect(getArtworkById(artworkId)).resolves.toBeNull();

      expect(mockDbConnect).not.toHaveBeenCalled();
      expect(mockFindById).not.toHaveBeenCalled();
      expect(mockToFrontend).not.toHaveBeenCalled();
    }
  );

  it("returns null when the artwork does not exist", async () => {
    mockLeanResult(null);

    await expect(getArtworkById(validArtworkId)).resolves.toBeNull();

    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockFindById).toHaveBeenCalledWith(validArtworkId);
    expect(mockToFrontend).not.toHaveBeenCalled();
  });

  it("returns transformed frontend artwork for an existing artwork", async () => {
    mockLeanResult(leanArtwork);
    mockToFrontend.mockReturnValue(frontendArtwork);

    await expect(getArtworkById(validArtworkId, "user-123")).resolves.toBe(
      frontendArtwork
    );

    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockFindById).toHaveBeenCalledWith(validArtworkId);
    expect(mockToFrontend).toHaveBeenCalledWith(leanArtwork, "user-123");
  });
});
