import { getCollectionPrototypeEntries } from "@/components/prototypes/home/CollectionPrototypeLoader";
import { getCollectionList } from "@/lib/data/services/getCollectionList";
import { isNextError } from "@/lib/helpers/isNextError";

jest.mock("@/lib/data/services/getCollectionList", () => ({
  getCollectionList: jest.fn(),
}));

jest.mock("@/lib/helpers/isNextError", () => ({
  isNextError: jest.fn(),
}));

const mockGetCollectionList = getCollectionList as jest.MockedFunction<
  typeof getCollectionList
>;
const mockIsNextError = isNextError as jest.MockedFunction<typeof isNextError>;

const createCollection = (slug: string) =>
  ({
    slug,
    title: slug,
    subtitle: `${slug} subtitle`,
    summary: `${slug} summary`,
    text: `${slug} text`,
    imageUrl: `https://res.cloudinary.com/dzncmfirr/image/upload/${slug}.jpg`,
    section: "collections",
    artworkCount: 3,
    firstArtworkId: `${slug}-artwork`,
  }) as never;

describe("getCollectionPrototypeEntries", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsNextError.mockReturnValue(false);
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("loads collection data through the same server service config as the live homepage section", async () => {
    const collections = [
      createCollection("extra-large"),
      createCollection("portraits-of-beryl"),
    ];
    mockGetCollectionList.mockResolvedValue({
      success: true,
      data: collections,
      metadata: {
        page: 1,
        limit: 9,
        total: 2,
        totalPages: 1,
      },
    });

    await expect(getCollectionPrototypeEntries()).resolves.toBe(collections);

    expect(mockGetCollectionList).toHaveBeenCalledWith({
      section: "collections",
      limit: 9,
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns an empty list when no collections exist", async () => {
    mockGetCollectionList.mockResolvedValue(null);

    await expect(getCollectionPrototypeEntries()).resolves.toEqual([]);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns an empty list for non-Next loading failures", async () => {
    const error = new Error("private collection failure");
    mockGetCollectionList.mockRejectedValue(error);

    await expect(getCollectionPrototypeEntries()).resolves.toEqual([]);

    expect(mockIsNextError).toHaveBeenCalledWith(error);
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.prototype.home.collection.failed",
        component: "CollectionPrototypeLoader",
        operation: "prototype.home.collection.loader",
        error: {
          name: "Error",
          message: "private collection failure",
        },
      })
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rethrows Next control-flow errors", async () => {
    const error = new Error("NEXT_REDIRECT");
    mockGetCollectionList.mockRejectedValue(error);
    mockIsNextError.mockReturnValue(true);

    await expect(getCollectionPrototypeEntries()).rejects.toThrow(error);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
