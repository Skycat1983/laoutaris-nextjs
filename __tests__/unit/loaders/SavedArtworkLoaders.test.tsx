import fs from "fs";
import path from "path";
import React, { type ReactElement } from "react";
import { FavouritesPaginationLoader } from "@/components/loaders/componentLoaders/FavouritesPaginationLoader";
import { WatchlistPaginationLoader } from "@/components/loaders/componentLoaders/WatchlistPaginationLoader";
import { FavouritedArtworkLoader } from "@/components/loaders/viewLoaders/FavouritedArtworkLoader";
import { WatchlistedArtworkLoader } from "@/components/loaders/viewLoaders/WatclistedArtworkLoader";
import { ScrollableArtworkPagination } from "@/components/modules/pagination/ScrollableArtworkPagination";
import { ArtworkView } from "@/components/views/ArtworkView";
import {
  getOwnFavouriteArtwork,
  getOwnFavouriteArtworkList,
  getOwnWatchlistArtwork,
  getOwnWatchlistArtworkList,
} from "@/lib/data/services/getOwnSavedArtwork";
import type { ArtworkFrontend } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

jest.mock("@/lib/data/services/getOwnSavedArtwork", () => ({
  getOwnFavouriteArtworkList: jest.fn(),
  getOwnFavouriteArtwork: jest.fn(),
  getOwnWatchlistArtworkList: jest.fn(),
  getOwnWatchlistArtwork: jest.fn(),
}));

jest.mock("@/lib/session/getUserIdFromSession", () => ({
  getUserIdFromSession: jest.fn(),
}));

jest.mock("@/lib/helpers/isNextError", () => ({
  isNextError: jest.fn(),
}));

jest.mock("@/components/modules/pagination/ScrollableArtworkPagination", () => ({
  ScrollableArtworkPagination: jest.fn(() => null),
}));

jest.mock("@/components/views/ArtworkView", () => ({
  ArtworkView: jest.fn(() => null),
}));

const mockGetOwnFavouriteArtworkList =
  getOwnFavouriteArtworkList as jest.MockedFunction<
    typeof getOwnFavouriteArtworkList
  >;
const mockGetOwnWatchlistArtworkList =
  getOwnWatchlistArtworkList as jest.MockedFunction<
    typeof getOwnWatchlistArtworkList
  >;
const mockGetOwnFavouriteArtwork =
  getOwnFavouriteArtwork as jest.MockedFunction<typeof getOwnFavouriteArtwork>;
const mockGetOwnWatchlistArtwork =
  getOwnWatchlistArtwork as jest.MockedFunction<typeof getOwnWatchlistArtwork>;
const mockGetUserIdFromSession = getUserIdFromSession as jest.MockedFunction<
  typeof getUserIdFromSession
>;
const mockIsNextError = isNextError as jest.MockedFunction<typeof isNextError>;

const userId = "507f1f77bcf86cd799439011";
const artworkId = "64f1f77bcf86cd799439022";

type ArtworkFixture = ArtworkFrontend & {
  _id: string;
  title: string;
};

const createArtwork = (id: string) =>
  ({
    _id: id,
    title: id,
  }) as ArtworkFixture;

describe("saved artwork account loaders", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserIdFromSession.mockResolvedValue(userId);
    mockIsNextError.mockReturnValue(false);
    mockGetOwnFavouriteArtworkList.mockResolvedValue({
      artworks: [],
      metadata: { total: 0, page: 1, limit: 0, totalPages: 1 },
    });
    mockGetOwnWatchlistArtworkList.mockResolvedValue({
      artworks: [],
      metadata: { total: 0, page: 1, limit: 0, totalPages: 1 },
    });
    mockGetOwnFavouriteArtwork.mockResolvedValue({
      status: "found",
      artwork: createArtwork(artworkId),
    });
    mockGetOwnWatchlistArtwork.mockResolvedValue({
      status: "found",
      artwork: createArtwork(artworkId),
    });
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders favourite pagination links through the server service without same-app fetches", async () => {
    const artworks = [
      createArtwork("64f1f77bcf86cd7994390111"),
      createArtwork("64f1f77bcf86cd7994390112"),
    ];
    mockGetOwnFavouriteArtworkList.mockResolvedValue({
      artworks,
      metadata: { total: 2, page: 1, limit: 2, totalPages: 1 },
    });

    const element = (await FavouritesPaginationLoader()) as ReactElement<{
      children: React.ReactNode;
    }>;
    const children = React.Children.toArray(
      element.props.children
    ) as ReactElement[];

    expect(mockGetUserIdFromSession).toHaveBeenCalledTimes(1);
    expect(mockGetOwnFavouriteArtworkList).toHaveBeenCalledWith(userId);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(children[0].type).toBe(ScrollableArtworkPagination);
    expect(children[0].props).toEqual({
      heading: "Your Favourites",
      items: [
        {
          ...artworks[0],
          link: "/account/favourites/64f1f77bcf86cd7994390111",
        },
        {
          ...artworks[1],
          link: "/account/favourites/64f1f77bcf86cd7994390112",
        },
      ],
    });
  });

  it("renders watchlist pagination links through the server service without same-app fetches", async () => {
    const artworks = [createArtwork("64f1f77bcf86cd7994390333")];
    mockGetOwnWatchlistArtworkList.mockResolvedValue({
      artworks,
      metadata: { total: 1, page: 1, limit: 1, totalPages: 1 },
    });

    const element = (await WatchlistPaginationLoader()) as ReactElement<{
      children: React.ReactNode;
    }>;
    const children = React.Children.toArray(
      element.props.children
    ) as ReactElement[];

    expect(mockGetOwnWatchlistArtworkList).toHaveBeenCalledWith(userId);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(children[0].type).toBe(ScrollableArtworkPagination);
    expect(children[0].props).toEqual({
      heading: "Your Watchlist",
      items: [
        {
          ...artworks[0],
          link: "/account/watchlist/64f1f77bcf86cd7994390333",
        },
      ],
    });
  });

  it("renders one favourited artwork through the server service without same-app fetches", async () => {
    const artwork = createArtwork(artworkId);
    mockGetOwnFavouriteArtwork.mockResolvedValue({
      status: "found",
      artwork,
    });

    const element = (await FavouritedArtworkLoader({
      artworkId,
    })) as ReactElement<{ children: React.ReactNode }>;
    const children = React.Children.toArray(
      element.props.children
    ) as ReactElement[];

    expect(mockGetOwnFavouriteArtwork).toHaveBeenCalledWith(userId, artworkId);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(children[0].type).toBe(ArtworkView);
    expect(children[0].props).toEqual(artwork);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("renders one watchlisted artwork through the server service without same-app fetches", async () => {
    const artwork = createArtwork(artworkId);
    mockGetOwnWatchlistArtwork.mockResolvedValue({
      status: "found",
      artwork,
    });

    const element = (await WatchlistedArtworkLoader({
      artworkId,
    })) as ReactElement<{ children: React.ReactNode }>;
    const children = React.Children.toArray(
      element.props.children
    ) as ReactElement[];

    expect(mockGetOwnWatchlistArtwork).toHaveBeenCalledWith(userId, artworkId);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(children[0].type).toBe(ArtworkView);
    expect(children[0].props).toEqual(artwork);
  });

  it("keeps list loaders throwing before service work when the session is missing", async () => {
    mockGetUserIdFromSession.mockResolvedValue(null);

    await expect(FavouritesPaginationLoader()).rejects.toThrow("Unauthorized");
    await expect(WatchlistPaginationLoader()).rejects.toThrow("Unauthorized");

    expect(mockGetOwnFavouriteArtworkList).not.toHaveBeenCalled();
    expect(mockGetOwnWatchlistArtworkList).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("keeps favourited artwork loader failure UI for missing sessions and missing saved artwork", async () => {
    mockGetUserIdFromSession.mockResolvedValueOnce(null);

    await expect(
      FavouritedArtworkLoader({ artworkId })
    ).resolves.toMatchObject({
      type: "div",
      props: { children: "Error fetching artwork" },
    });
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.account.favourite_artwork.failed",
        component: "FavouritedArtworkLoader",
        operation: "account.favourite_artwork.loader",
        surface: "server_loader",
        statusCategory: "missing_session",
        hasArtworkId: true,
        error: {
          name: "Error",
          message: "Account favourite artwork loader failed",
        },
      })
    );
    expect(consoleErrorSpy.mock.calls[0][0]).not.toContain(userId);
    expect(consoleErrorSpy.mock.calls[0][0]).not.toContain(artworkId);

    mockGetUserIdFromSession.mockResolvedValue(userId);
    mockGetOwnFavouriteArtwork.mockResolvedValue({
      status: "not-in-favourites",
    });

    await expect(
      FavouritedArtworkLoader({ artworkId })
    ).resolves.toMatchObject({
      type: "div",
      props: { children: "Error fetching artwork" },
    });
    expect(JSON.parse(consoleErrorSpy.mock.calls[1][0])).toEqual(
      expect.objectContaining({
        event: "loader.account.favourite_artwork.failed",
        component: "FavouritedArtworkLoader",
        operation: "account.favourite_artwork.loader",
        surface: "server_loader",
        statusCategory: "not_in_favourites",
        hasArtworkId: true,
        error: {
          name: "Error",
          message: "Account favourite artwork loader failed",
        },
      })
    );
    expect(consoleErrorSpy.mock.calls[1][0]).not.toContain(userId);
    expect(consoleErrorSpy.mock.calls[1][0]).not.toContain(artworkId);

    mockGetOwnFavouriteArtwork.mockResolvedValue({
      status: "artwork-not-found",
    });

    await expect(
      FavouritedArtworkLoader({ artworkId })
    ).resolves.toMatchObject({
      type: "div",
      props: { children: "Error fetching artwork" },
    });
    expect(JSON.parse(consoleErrorSpy.mock.calls[2][0])).toEqual(
      expect.objectContaining({
        event: "loader.account.favourite_artwork.failed",
        component: "FavouritedArtworkLoader",
        operation: "account.favourite_artwork.loader",
        surface: "server_loader",
        statusCategory: "artwork_not_found",
        hasArtworkId: true,
        error: {
          name: "Error",
          message: "Account favourite artwork loader failed",
        },
      })
    );
    expect(consoleErrorSpy.mock.calls[2][0]).not.toContain(userId);
    expect(consoleErrorSpy.mock.calls[2][0]).not.toContain(artworkId);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("keeps favourited artwork loader failure logs generic for service errors", async () => {
    const error = new Error(`private saved artwork failure for ${userId}`);
    mockGetOwnFavouriteArtwork.mockRejectedValue(error);

    await expect(
      FavouritedArtworkLoader({ artworkId })
    ).resolves.toMatchObject({
      type: "div",
      props: { children: "Error fetching artwork" },
    });

    expect(mockIsNextError).toHaveBeenCalledWith(error);
    expect(global.fetch).not.toHaveBeenCalled();

    const payload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
    expect(payload).toEqual(
      expect.objectContaining({
        event: "loader.account.favourite_artwork.failed",
        statusCategory: "unexpected_error",
        hasArtworkId: true,
        error: {
          name: "Error",
          message: "Account favourite artwork loader failed",
        },
      })
    );
    expect(JSON.stringify(payload)).not.toContain("private saved artwork failure");
    expect(JSON.stringify(payload)).not.toContain(userId);
    expect(JSON.stringify(payload)).not.toContain(artworkId);
  });

  it("keeps watchlisted artwork loader throwing route-style saved-artwork errors", async () => {
    mockGetOwnWatchlistArtwork.mockResolvedValue({
      status: "not-in-watchlist",
    });

    await expect(WatchlistedArtworkLoader({ artworkId })).rejects.toThrow(
      "Artwork not in watchlist"
    );

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("converts non-Next list service failures to route-style loader errors", async () => {
    const error = new Error("private saved list failure");
    mockGetOwnFavouriteArtworkList.mockRejectedValue(error);

    await expect(FavouritesPaginationLoader()).rejects.toThrow(
      "Failed to fetch user favourites"
    );

    expect(mockIsNextError).toHaveBeenCalledWith(error);
  });

  it("rethrows Next control-flow errors from the watchlist detail service", async () => {
    const error = new Error("NEXT_REDIRECT");
    mockGetOwnWatchlistArtwork.mockRejectedValue(error);
    mockIsNextError.mockReturnValue(true);

    await expect(WatchlistedArtworkLoader({ artworkId })).rejects.toThrow(
      error
    );

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rethrows Next control-flow errors from the favourited artwork detail service without logging", async () => {
    const error = new Error("NEXT_REDIRECT");
    mockGetOwnFavouriteArtwork.mockRejectedValue(error);
    mockIsNextError.mockReturnValue(true);

    await expect(FavouritedArtworkLoader({ artworkId })).rejects.toThrow(error);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not import same-app HTTP dependencies or direct fetches", () => {
    const files = [
      "src/components/loaders/componentLoaders/FavouritesPaginationLoader.tsx",
      "src/components/loaders/componentLoaders/WatchlistPaginationLoader.tsx",
      "src/components/loaders/viewLoaders/FavouritedArtworkLoader.tsx",
      "src/components/loaders/viewLoaders/WatclistedArtworkLoader.tsx",
    ];
    const retiredUserApiName = ["server", "UserApi"].join("");

    for (const file of files) {
      const source = fs.readFileSync(path.join(process.cwd(), file), "utf8");
      expect(source).not.toMatch(
        new RegExp(
          `${retiredUserApiName}|serverApi|fetchUser|favourites\\.get|watchlist\\.get|fetch\\(`
        )
      );
    }
  });
});
