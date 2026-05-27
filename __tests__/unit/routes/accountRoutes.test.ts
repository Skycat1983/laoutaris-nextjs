import {
  accountFavouritesPath,
  accountRootPath,
  accountSettingsPath,
  accountSignInPath,
  accountSignUpPath,
  accountWatchlistPath,
} from "@/lib/routes/accountRoutes";

describe("accountRoutes", () => {
  it("exports the current account UI entry paths", () => {
    expect(accountRootPath).toBe("/account");
    expect(accountSettingsPath).toBe("/account/settings");
    expect(accountSignInPath).toBe("/sign-in");
    expect(accountSignUpPath).toBe("/sign-in?mode=signup");
  });

  it("builds account saved-artwork list and detail paths", () => {
    expect(accountFavouritesPath()).toBe("/account/favourites");
    expect(accountFavouritesPath("artwork-1")).toBe(
      "/account/favourites/artwork-1"
    );
    expect(accountFavouritesPath("artwork 1")).toBe(
      "/account/favourites/artwork%201"
    );

    expect(accountWatchlistPath()).toBe("/account/watchlist");
    expect(accountWatchlistPath("artwork-2")).toBe(
      "/account/watchlist/artwork-2"
    );
    expect(accountWatchlistPath("artwork 2")).toBe(
      "/account/watchlist/artwork%202"
    );
  });
});
