import { authProtectedRoutes } from "@/lib/routes/authProtectedRoutes";
import { publicAppRoutes } from "@/lib/routes/publicAppRoutes";

export const accountRootPath = authProtectedRoutes.account;
export const accountSettingsPath = authProtectedRoutes.accountSettings;
export const accountSignInPath = publicAppRoutes.signIn;

const signUpSearchParams = new URLSearchParams({ mode: "signup" });

export const accountSignUpPath = `${accountSignInPath}?${signUpSearchParams.toString()}`;

const accountDetailPath = (basePath: string, artworkId?: string) =>
  artworkId ? `${basePath}/${encodeURIComponent(artworkId)}` : basePath;

export const accountFavouritesPath = (artworkId?: string) =>
  accountDetailPath(`${accountRootPath}/favourites`, artworkId);

export const accountWatchlistPath = (artworkId?: string) =>
  accountDetailPath(`${accountRootPath}/watchlist`, artworkId);
