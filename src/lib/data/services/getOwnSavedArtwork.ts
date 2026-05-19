import "server-only";

import { ArtworkModel } from "@/lib/data/models/artworkModel";
import { UserModel } from "@/lib/data/models/userModel";
import type { ArtworkFrontend, ArtworkLean, PaginationMetadata } from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";

type SavedArtworkListField = "favourites" | "watchlist";

type UserWithSavedArtwork = {
  _id: string;
  favourites?: ArtworkLean[];
  watchlist?: ArtworkLean[];
};

export type OwnSavedArtworkListServiceResult = {
  artworks: ArtworkFrontend[];
  metadata: Required<PaginationMetadata>;
} | null;

type OwnSavedArtworkItemFound = {
  status: "found";
  artwork: ArtworkFrontend;
};

type OwnSavedArtworkItemMissing = {
  status: "artwork-not-found";
};

export type OwnFavouriteArtworkItemServiceResult =
  | OwnSavedArtworkItemFound
  | OwnSavedArtworkItemMissing
  | {
      status: "not-in-favourites";
    };

export type OwnWatchlistArtworkItemServiceResult =
  | OwnSavedArtworkItemFound
  | OwnSavedArtworkItemMissing
  | {
      status: "not-in-watchlist";
    };

const buildSinglePageMetadata = (
  total: number
): Required<PaginationMetadata> => ({
  total,
  page: 1,
  limit: total,
  totalPages: 1,
});

const getOwnSavedArtworkList = async (
  userId: string,
  field: SavedArtworkListField
): Promise<OwnSavedArtworkListServiceResult> => {
  await dbConnect();

  const userWithSavedArtwork = await UserModel.findById(userId)
    .select(field)
    .populate(field)
    .lean<UserWithSavedArtwork>();

  if (!userWithSavedArtwork) {
    return null;
  }

  const savedArtwork = userWithSavedArtwork[field] ?? [];
  const artworks = savedArtwork.map((artwork) =>
    transformArtwork.toFrontend(artwork)
  );

  return {
    artworks,
    metadata: buildSinglePageMetadata(artworks.length),
  };
};

const getOwnSavedArtworkItem = async <
  TNotSavedStatus extends "not-in-favourites" | "not-in-watchlist",
>(
  userId: string,
  artworkId: string,
  savedStateKey: "isFavourited" | "isWatchlisted",
  notSavedStatus: TNotSavedStatus
): Promise<
  | OwnSavedArtworkItemFound
  | OwnSavedArtworkItemMissing
  | { status: TNotSavedStatus }
> => {
  await dbConnect();

  const leanArtwork = (await ArtworkModel.findById(
    artworkId
  ).lean()) as ArtworkLean | null;

  if (!leanArtwork) {
    return {
      status: "artwork-not-found",
    };
  }

  const artwork = transformArtwork.toFrontend(leanArtwork, userId);

  if (!artwork[savedStateKey]) {
    return {
      status: notSavedStatus,
    };
  }

  return {
    status: "found",
    artwork,
  };
};

export const getOwnFavouriteArtworkList = (
  userId: string
): Promise<OwnSavedArtworkListServiceResult> =>
  getOwnSavedArtworkList(userId, "favourites");

export const getOwnWatchlistArtworkList = (
  userId: string
): Promise<OwnSavedArtworkListServiceResult> =>
  getOwnSavedArtworkList(userId, "watchlist");

export const getOwnFavouriteArtwork = (
  userId: string,
  artworkId: string
): Promise<OwnFavouriteArtworkItemServiceResult> =>
  getOwnSavedArtworkItem(
    userId,
    artworkId,
    "isFavourited",
    "not-in-favourites"
  );

export const getOwnWatchlistArtwork = (
  userId: string,
  artworkId: string
): Promise<OwnWatchlistArtworkItemServiceResult> =>
  getOwnSavedArtworkItem(
    userId,
    artworkId,
    "isWatchlisted",
    "not-in-watchlist"
  );
