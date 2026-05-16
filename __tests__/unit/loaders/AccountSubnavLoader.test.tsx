import type { ReactElement } from "react";
import fs from "fs";
import path from "path";
import { AccountSubnavLoader } from "@/components/loaders/componentLoaders/AccountSubnavLoader";
import { Subnav } from "@/components/modules/navigation/subnav/Subnav";
import { getOwnUserNavigation } from "@/lib/data/services/getOwnUserNavigation";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

jest.mock("@/lib/data/services/getOwnUserNavigation", () => ({
  getOwnUserNavigation: jest.fn(),
}));

jest.mock("@/lib/session/getUserIdFromSession", () => ({
  getUserIdFromSession: jest.fn(),
}));

jest.mock("@/components/modules/navigation/subnav/Subnav", () => ({
  Subnav: jest.fn(() => null),
}));

const mockGetOwnUserNavigation = getOwnUserNavigation as jest.MockedFunction<
  typeof getOwnUserNavigation
>;
const mockGetUserIdFromSession = getUserIdFromSession as jest.MockedFunction<
  typeof getUserIdFromSession
>;

const userId = "507f1f77bcf86cd799439011";

describe("AccountSubnavLoader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserIdFromSession.mockResolvedValue(userId);
    mockGetOwnUserNavigation.mockResolvedValue({
      favourites: ["favourite-1"],
      watchlist: ["watchlist-1"],
      comments: ["comment-1"],
      firstFavouriteId: "favourite-1",
      firstWatchlistId: "watchlist-1",
      firstCommentId: "comment-1",
      hasFavourites: true,
      hasWatchlist: true,
      hasComments: true,
    } as never);
  });

  it("loads account links through the server service without same-app fetches", async () => {
    const element = (await AccountSubnavLoader()) as ReactElement<{
      links: Array<{
        label: string;
        slug: string;
        link_to: string | null;
        disabled: boolean;
      }>;
    }>;

    expect(mockGetUserIdFromSession).toHaveBeenCalledTimes(1);
    expect(mockGetOwnUserNavigation).toHaveBeenCalledWith(userId);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(Subnav);
    expect(element.props.links).toEqual([
      {
        label: "Settings",
        slug: "settings",
        link_to: "/account/settings",
        disabled: false,
      },
      {
        label: "Favourites",
        slug: "favourites",
        link_to: "/account/favourites/favourite-1",
        disabled: false,
      },
      {
        label: "Watchlist",
        slug: "watchlist",
        link_to: "/account/watchlist/watchlist-1",
        disabled: false,
      },
      {
        label: "Comments",
        slug: "comments",
        link_to: "/account/comments",
        disabled: false,
      },
      {
        label: "Cart",
        slug: "cart",
        link_to: null,
        disabled: true,
      },
      {
        label: "Orders",
        slug: "orders",
        link_to: null,
        disabled: true,
      },
    ]);
  });

  it("keeps empty saved-item and comments links disabled", async () => {
    mockGetOwnUserNavigation.mockResolvedValue({
      favourites: [],
      watchlist: [],
      comments: [],
      firstFavouriteId: null,
      firstWatchlistId: null,
      firstCommentId: null,
      hasFavourites: false,
      hasWatchlist: false,
      hasComments: false,
    } as never);

    const element = (await AccountSubnavLoader()) as ReactElement<{
      links: Array<{
        label: string;
        slug: string;
        link_to: string | null;
        disabled: boolean;
      }>;
    }>;

    expect(element.props.links).toEqual([
      {
        label: "Settings",
        slug: "settings",
        link_to: "/account/settings",
        disabled: false,
      },
      {
        label: "Favourites",
        slug: "favourites",
        link_to: null,
        disabled: true,
      },
      {
        label: "Watchlist",
        slug: "watchlist",
        link_to: null,
        disabled: true,
      },
      {
        label: "Comments",
        slug: "comments",
        link_to: null,
        disabled: true,
      },
      {
        label: "Cart",
        slug: "cart",
        link_to: null,
        disabled: true,
      },
      {
        label: "Orders",
        slug: "orders",
        link_to: null,
        disabled: true,
      },
    ]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("throws the existing unauthorized loader error before service work", async () => {
    mockGetUserIdFromSession.mockResolvedValue(null);

    await expect(AccountSubnavLoader()).rejects.toThrow("Unauthorized");

    expect(mockGetOwnUserNavigation).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(Subnav).not.toHaveBeenCalled();
  });

  it("throws the existing missing-user loader error when the service returns null", async () => {
    mockGetOwnUserNavigation.mockResolvedValue(null);

    await expect(AccountSubnavLoader()).rejects.toThrow("User not found");

    expect(mockGetOwnUserNavigation).toHaveBeenCalledWith(userId);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(Subnav).not.toHaveBeenCalled();
  });

  it("converts service failures to the existing user navigation loader error", async () => {
    mockGetOwnUserNavigation.mockRejectedValue(
      new Error("private navigation failure")
    );

    await expect(AccountSubnavLoader()).rejects.toThrow(
      "Failed to fetch user navigation"
    );

    expect(global.fetch).not.toHaveBeenCalled();
    expect(Subnav).not.toHaveBeenCalled();
  });

  it("does not import same-app HTTP clients or direct fetches", () => {
    const loaderSource = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/components/loaders/componentLoaders/AccountSubnavLoader.tsx"
      ),
      "utf8"
    );

    expect(loaderSource).not.toMatch(
      /serverUserApi|serverApi|fetchUserNavigation|fetch\(/
    );
  });
});
