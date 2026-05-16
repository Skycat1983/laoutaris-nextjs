import {
  Subnav,
  SubnavLink,
} from "@/components/modules/navigation/subnav/Subnav";
import {
  getOwnUserNavigation,
  type OwnUserNavigationServiceResult,
} from "@/lib/data/services/getOwnUserNavigation";
import { createSubnavLink } from "@/lib/helpers/createSubnavLink";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import React from "react";

const AccountSubnavLoader = async () => {
  const userId = await getUserIdFromSession();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  let data: OwnUserNavigationServiceResult;

  try {
    data = await getOwnUserNavigation(userId);
  } catch {
    throw new Error("Failed to fetch user navigation");
  }

  if (!data) {
    throw new Error("User not found");
  }

  const stem = "account";

  const settings = createSubnavLink(
    { label: "Settings", slug: "settings" },
    { stem }
  );

  const favourites = createSubnavLink(
    { label: "Favourites", slug: "favourites" },
    {
      stem,
      segments: data.firstFavouriteId ? [data.firstFavouriteId] : undefined,
      forceDisabled: data.favourites.length === 0,
    }
  );

  const watchlist = createSubnavLink(
    { label: "Watchlist", slug: "watchlist" },
    {
      stem,
      segments: data.firstWatchlistId ? [data.firstWatchlistId] : undefined,
      forceDisabled: data.watchlist.length === 0,
    }
  );

  const comments = createSubnavLink(
    { label: "Comments", slug: "comments" },
    {
      stem,
      forceDisabled: data.comments.length === 0,
    }
  );

  const cart = createSubnavLink(
    { label: "Cart", slug: "cart" },
    { stem, forceDisabled: true }
  );

  const orders = createSubnavLink(
    { label: "Orders", slug: "orders" },
    { stem, forceDisabled: true }
  );

  const links: SubnavLink[] = [
    settings,
    favourites,
    watchlist,
    comments,
    cart,
    orders,
  ];

  return <Subnav links={links} />;
};

export { AccountSubnavLoader };
