jest.mock("server-only", () => ({}), { virtual: true });

import { ArtworkModel } from "@/lib/data/models/artworkModel";
import { getArtworkList } from "@/lib/data/services/getArtworkList";
import dbConnect from "@/lib/db/mongodb";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";
import { findSimilarColors } from "@/lib/utils/colourUtils";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/artworkModel", () => ({
  ArtworkModel: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

jest.mock("@/lib/transforms/artwork/transformArtwork", () => ({
  transformArtwork: {
    toFrontend: jest.fn(),
  },
}));

jest.mock("@/lib/utils/colourUtils", () => ({
  findSimilarColors: jest.fn(),
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockFind = ArtworkModel.find as jest.Mock;
const mockCountDocuments = ArtworkModel.countDocuments as jest.Mock;
const mockToFrontend = transformArtwork.toFrontend as jest.Mock;
const mockFindSimilarColors = findSimilarColors as jest.MockedFunction<
  typeof findSimilarColors
>;

const mockSort = jest.fn();
const mockLean = jest.fn();

const createArtwork = (id: string, color: string) =>
  ({
    _id: id,
    title: `Artwork ${id}`,
    image: {
      hexColors: [
        {
          color,
          percentage: 60,
        },
        {
          color: "#ffffff",
          percentage: 40,
        },
      ],
    },
  } as never);

describe("getArtworkList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    mockSort.mockReturnThis();
    mockFind.mockReturnValue({
      sort: mockSort,
      lean: mockLean,
    });
    mockCountDocuments.mockResolvedValue(0);
    mockLean.mockResolvedValue([]);
    mockToFrontend.mockImplementation((artwork) => artwork);
  });

  it("uses MongoDB ownership, default sorting, pagination metadata, and frontend transforms", async () => {
    const artwork = createArtwork("a", "#111111");
    mockCountDocuments.mockResolvedValue(1);
    mockLean.mockResolvedValue([artwork]);
    mockToFrontend.mockReturnValue({ _id: "a", title: "Artwork a" });

    await expect(getArtworkList({ userId: "user-123" })).resolves.toEqual({
      success: true,
      data: [{ _id: "a", title: "Artwork a" }],
      metadata: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    });

    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockFind).toHaveBeenCalledWith({});
    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(mockCountDocuments).toHaveBeenCalledWith({});
    expect(mockToFrontend).toHaveBeenCalledWith(artwork, "user-123");
  });

  it("builds OR filter queries and preserves non-default sort and pagination", async () => {
    const query = {
      $or: [
        { decade: { $in: ["1970s", "1980s"] } },
        { medium: { $in: ["oil"] } },
      ],
    };

    await getArtworkList({
      filterMode: "ANY",
      decade: ["1970s", "1980s"],
      medium: ["oil"],
      sortBy: "mostPopular",
      page: 2,
      limit: 5,
    });

    expect(mockFind).toHaveBeenCalledWith(query);
    expect(mockSort).toHaveBeenCalledWith({ "favourited.length": -1 });
    expect(mockCountDocuments).toHaveBeenCalledWith(query);
  });

  it("sorts by color proximity before applying pagination", async () => {
    const lessSimilarArtwork = createArtwork("less-similar", "#222222");
    const moreSimilarArtwork = createArtwork("more-similar", "#111111");
    mockCountDocuments.mockResolvedValue(2);
    mockLean.mockResolvedValue([lessSimilarArtwork, moreSimilarArtwork]);
    mockFindSimilarColors.mockImplementation((_targetColor, colors) => [
      {
        color: colors[0],
        similarity: colors[0] === "#111111" ? 0 : 25,
      },
    ]);
    mockToFrontend.mockImplementation((artwork) => ({
      _id: artwork._id,
      image: artwork.image,
    }));

    const result = await getArtworkList({
      sortBy: "colorProximity",
      sortColor: "#111111",
      page: 1,
      limit: 1,
    });

    expect(mockSort).not.toHaveBeenCalled();
    expect(mockFindSimilarColors).toHaveBeenCalledTimes(2);
    expect(result.data).toEqual([
      {
        _id: "more-similar",
        image: {
          hexColors: [{ color: "#111111", percentage: 60 }],
          similarityScore: 0,
        },
      },
    ]);
    expect(result.metadata).toEqual({
      page: 1,
      limit: 1,
      total: 2,
      totalPages: 2,
    });
  });
});
