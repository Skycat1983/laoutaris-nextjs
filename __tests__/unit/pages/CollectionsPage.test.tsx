import CollectionsPage from "@/app/collections/page";
import { getCachedCollectionNavigationList } from "@/lib/data/services/getCachedCollectionNavigationData";
import type {
  CollectionNavDataFrontend,
  ListResult,
} from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { redirect } from "next/navigation";

jest.mock("@/lib/data/services/getCachedCollectionNavigationData", () => ({
  COLLECTION_NAVIGATION_CACHE_REVALIDATE_SECONDS: 600,
  getCachedCollectionNavigationList: jest.fn(),
}));

jest.mock("@/lib/helpers/isNextError", () => ({
  isNextError: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const mockGetCachedCollectionNavigationList =
  getCachedCollectionNavigationList as jest.MockedFunction<
    typeof getCachedCollectionNavigationList
  >;
const mockIsNextError = isNextError as jest.MockedFunction<typeof isNextError>;
const mockRedirect = redirect as unknown as jest.MockedFunction<
  typeof redirect
>;

const createCollectionNavItem = ({
  slug,
  title,
  firstArtworkId = null,
  hasArtwork = firstArtworkId !== null,
}: {
  slug: string;
  title: string;
  firstArtworkId?: CollectionNavDataFrontend["firstArtworkId"];
  hasArtwork?: boolean;
}): CollectionNavDataFrontend => ({
  _id: `collection-${slug}`,
  title,
  slug,
  artworks: [],
  firstArtworkId,
  hasArtwork,
});

const createCollectionNavResult = (
  data: CollectionNavDataFrontend[]
): ListResult<CollectionNavDataFrontend> => ({
  success: true,
  data,
  metadata: {
    page: 1,
    limit: data.length,
    total: data.length,
    totalPages: data.length ? 1 : 0,
  },
});

describe("/collections page", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mockIsNextError.mockReturnValue(false);
    mockGetCachedCollectionNavigationList.mockResolvedValue(
      createCollectionNavResult([
        createCollectionNavItem({
          title: "Paintings",
          slug: "paintings",
          firstArtworkId: "artwork-1",
        }),
        createCollectionNavItem({
          title: "Drawings",
          slug: "drawings",
          hasArtwork: false,
        }),
      ])
    );
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("redirects to the first collection artwork through the cached server data service", async () => {
    const redirectError = new Error("NEXT_REDIRECT");
    mockRedirect.mockImplementation(() => {
      throw redirectError;
    });
    mockIsNextError.mockImplementation((error) => error === redirectError);

    await expect(CollectionsPage()).rejects.toThrow(redirectError);

    expect(mockGetCachedCollectionNavigationList).toHaveBeenCalledWith();
    expect(mockRedirect).toHaveBeenCalledWith(
      "/collections/paintings/artwork-1"
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("preserves the empty first-artwork redirect fallback", async () => {
    const redirectError = new Error("NEXT_REDIRECT");
    mockRedirect.mockImplementation(() => {
      throw redirectError;
    });
    mockIsNextError.mockImplementation((error) => error === redirectError);
    mockGetCachedCollectionNavigationList.mockResolvedValue(
      createCollectionNavResult([
        createCollectionNavItem({
          title: "Drawings",
          slug: "drawings",
          hasArtwork: false,
        }),
      ])
    );

    await expect(CollectionsPage()).rejects.toThrow(redirectError);

    expect(mockRedirect).toHaveBeenCalledWith("/collections/drawings");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("throws the existing no-results error when no collections exist", async () => {
    mockGetCachedCollectionNavigationList.mockResolvedValue(null);

    await expect(CollectionsPage()).rejects.toThrow("No collections found");

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "page.public.collections_redirect.failed",
        route: "/collections",
        operation: "public.collections.default_redirect",
        error: {
          name: "Error",
          message: "No collections found",
        },
      })
    );
  });

  it("logs a structured error when collection loading fails", async () => {
    const error = new Error("navigation failed");
    mockGetCachedCollectionNavigationList.mockRejectedValue(error);

    await expect(CollectionsPage()).rejects.toThrow(error);

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "page.public.collections_redirect.failed",
        error: {
          name: "Error",
          message: "navigation failed",
        },
      })
    );
  });
});
