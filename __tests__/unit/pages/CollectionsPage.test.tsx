import CollectionsPage from "@/app/collections/page";
import { getCollectionNavigationList } from "@/lib/data/services/getCollectionNavigationList";
import { isNextError } from "@/lib/helpers/isNextError";
import { redirect } from "next/navigation";

jest.mock("@/lib/data/services/getCollectionNavigationList", () => ({
  getCollectionNavigationList: jest.fn(),
}));

jest.mock("@/lib/helpers/isNextError", () => ({
  isNextError: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const mockGetCollectionNavigationList =
  getCollectionNavigationList as jest.MockedFunction<
    typeof getCollectionNavigationList
  >;
const mockIsNextError = isNextError as jest.MockedFunction<typeof isNextError>;
const mockRedirect = redirect as unknown as jest.MockedFunction<
  typeof redirect
>;

describe("/collections page", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mockIsNextError.mockReturnValue(false);
    mockGetCollectionNavigationList.mockResolvedValue({
      success: true,
      data: [
        {
          title: "Paintings",
          slug: "paintings",
          firstArtworkId: "artwork-1",
          hasArtwork: true,
        },
        {
          title: "Drawings",
          slug: "drawings",
          firstArtworkId: null,
          hasArtwork: false,
        },
      ],
      metadata: {
        page: 1,
        limit: 2,
        total: 2,
        totalPages: 1,
      },
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("redirects to the first collection artwork through the server data service", async () => {
    const redirectError = new Error("NEXT_REDIRECT");
    mockRedirect.mockImplementation(() => {
      throw redirectError;
    });
    mockIsNextError.mockImplementation((error) => error === redirectError);

    await expect(CollectionsPage()).rejects.toThrow(redirectError);

    expect(mockGetCollectionNavigationList).toHaveBeenCalledWith();
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
    mockGetCollectionNavigationList.mockResolvedValue({
      success: true,
      data: [
        {
          title: "Drawings",
          slug: "drawings",
          firstArtworkId: null,
          hasArtwork: false,
        },
      ],
      metadata: {
        page: 1,
        limit: 1,
        total: 1,
        totalPages: 1,
      },
    });

    await expect(CollectionsPage()).rejects.toThrow(redirectError);

    expect(mockRedirect).toHaveBeenCalledWith("/collections/drawings");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("throws the existing no-results error when no collections exist", async () => {
    mockGetCollectionNavigationList.mockResolvedValue(null);

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
    mockGetCollectionNavigationList.mockRejectedValue(error);

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
