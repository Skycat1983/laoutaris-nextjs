import {
  Subnav,
  SubnavLink,
} from "@/components/modules/navigation/subnav/Subnav";
import { serverApi } from "@/lib/api/serverApi";
import { ApiErrorResponse } from "@/lib/data/types";
import React from "react";
import { ApiOwnUserNavResult } from "@/lib/api/user/navigation/fetchers";
import { createSubnavLink } from "@/lib/helpers/createSubnavLink";

type UserNavFetchResult = ApiOwnUserNavResult | ApiErrorResponse;

const AccountSubnavLoader = async () => {
  const result: UserNavFetchResult =
    await serverApi.user.navigation.fetchUserNavigation();

  if (!result.success) {
    throw new Error(result.error);
  }

  const { data } = result;
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
