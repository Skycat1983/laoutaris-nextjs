import CollectionSlugPage from "@/app/collections/[slug]/page";
import CollectionSlugNotFound from "@/app/collections/[slug]/not-found";
import { getCollectionNavigationItem } from "@/lib/data/services/getCollectionNavigationItem";
import type { CollectionNavDataFrontend } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { notFound, redirect } from "next/navigation";
import { render, screen } from "@testing-library/react";

jest.mock("@/lib/data/services/getCollectionNavigationItem", () => ({
  getCollectionNavigationItem: jest.fn(),
}));

jest.mock("@/lib/helpers/isNextError", () => ({
  isNextError: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
  redirect: jest.fn(),
}));

const mockGetCollectionNavigationItem =
  getCollectionNavigationItem as jest.MockedFunction<
    typeof getCollectionNavigationItem
  >;
const mockIsNextError = isNextError as jest.MockedFunction<typeof isNextError>;
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;
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
    mockGetCollectionNavigationItem.mockResolvedValue(
      createCollectionNavItem({
        title: "Paintings",
        slug: "paintings",
        firstArtworkId: "artwork-1",
      })
    );
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
    mockGetCollectionNavigationItem.mockResolvedValue(
      createCollectionNavItem({
        title: "Drawings",
        slug: "drawings",
        hasArtwork: false,
      })
    );

    await expect(
      CollectionSlugPage({ params: { slug: "drawings" } })
    ).rejects.toThrow(redirectError);

    expect(mockRedirect).toHaveBeenCalledWith("/collections/drawings");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("uses shared public presentation for the route-local collection not-found view", () => {
    render(<CollectionSlugNotFound />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Collection not found"
    );
    expect(screen.getByText("Not found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The requested collection is not available in the archive."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Browse collections" })
    ).toHaveAttribute("href", "/collections");
  });

  it("calls notFound without logging when the service returns null", async () => {
    const notFoundError = new Error("NEXT_NOT_FOUND");
    mockGetCollectionNavigationItem.mockResolvedValue(null);
    mockNotFound.mockImplementation(() => {
      throw notFoundError;
    });
    mockIsNextError.mockImplementation((error) => error === notFoundError);

    await expect(
      CollectionSlugPage({ params: { slug: "missing" } })
    ).rejects.toThrow(notFoundError);

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(mockNotFound).toHaveBeenCalledTimes(1);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
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
