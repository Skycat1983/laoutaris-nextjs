import CollectionSlugPage from "@/app/collections/[slug]/page";
import { getCollectionNavigationItem } from "@/lib/data/services/getCollectionNavigationItem";
import { isNextError } from "@/lib/helpers/isNextError";
import { redirect } from "next/navigation";

jest.mock("@/lib/data/services/getCollectionNavigationItem", () => ({
  getCollectionNavigationItem: jest.fn(),
}));

jest.mock("@/lib/helpers/isNextError", () => ({
  isNextError: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const mockGetCollectionNavigationItem =
  getCollectionNavigationItem as jest.MockedFunction<
    typeof getCollectionNavigationItem
  >;
const mockIsNextError = isNextError as jest.MockedFunction<typeof isNextError>;
const mockRedirect = redirect as unknown as jest.MockedFunction<
  typeof redirect
>;

describe("/collections/[slug] page", () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => undefined);
    mockIsNextError.mockReturnValue(false);
    mockGetCollectionNavigationItem.mockResolvedValue({
      title: "Paintings",
      slug: "paintings",
      firstArtworkId: "artwork-1",
      hasArtwork: true,
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it("redirects to the selected collection artwork through the server data service", async () => {
    const redirectError = new Error("NEXT_REDIRECT");
    mockRedirect.mockImplementation(() => {
      throw redirectError;
    });
    mockIsNextError.mockImplementation((error) => error === redirectError);

    await expect(
      CollectionSlugPage({ params: { slug: "paintings" } })
    ).rejects.toThrow(redirectError);

    expect(mockGetCollectionNavigationItem).toHaveBeenCalledWith("paintings");
    expect(mockRedirect).toHaveBeenCalledWith(
      "/collections/paintings/artwork-1"
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("preserves the empty first-artwork redirect fallback", async () => {
    const redirectError = new Error("NEXT_REDIRECT");
    mockRedirect.mockImplementation(() => {
      throw redirectError;
    });
    mockIsNextError.mockImplementation((error) => error === redirectError);
    mockGetCollectionNavigationItem.mockResolvedValue({
      title: "Drawings",
      slug: "drawings",
      firstArtworkId: null,
      hasArtwork: false,
    });

    await expect(
      CollectionSlugPage({ params: { slug: "drawings" } })
    ).rejects.toThrow(redirectError);

    expect(mockRedirect).toHaveBeenCalledWith("/collections/drawings");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("throws the existing missing-collection error when the service returns null", async () => {
    mockGetCollectionNavigationItem.mockResolvedValue(null);

    await expect(
      CollectionSlugPage({ params: { slug: "missing" } })
    ).rejects.toThrow("Collection not found");

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "page.public.collection_slug_redirect.failed",
        route: "/collections/[slug]",
        operation: "public.collection_slug.redirect",
        slug: "missing",
        error: {
          name: "Error",
          message: "Collection not found",
        },
      })
    );
  });

  it("logs a structured error when collection loading fails", async () => {
    const error = new Error("navigation failed");
    mockGetCollectionNavigationItem.mockRejectedValue(error);

    await expect(
      CollectionSlugPage({ params: { slug: "paintings" } })
    ).rejects.toThrow(error);

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "page.public.collection_slug_redirect.failed",
        slug: "paintings",
        error: {
          name: "Error",
          message: "navigation failed",
        },
      })
    );
  });
});
