import {
  Subnav,
  SubnavLink,
} from "@/components/modules/navigation/subnav/Subnav";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
import { serverApi } from "@/lib/api/serverApi";
import { OwnUserNavigationFetchers } from "@/lib/api/user/navigation/fetchers";
import {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
  OwnUserNavFields,
} from "@/lib/data/types";
import { buildUrl } from "@/lib/utils/buildUrl";
import React from "react";
import { ApiOwnUserNavResult } from "@/lib/api/user/navigation/fetchers";
const firstId = (arr: string[]) => arr[0];

type UserNavFetchResult = ApiOwnUserNavResult | ApiErrorResponse;

const AccountSubnavLoader = async () => {
  const result: UserNavFetchResult =
    await serverApi.user.navigation.fetchUserNavigationList();

  if (!result.success) {
    throw new Error(result.error);
  }

  const { data } = result;

  const links: SubnavLink[] = [];

  const stem = "account";

  links.push({
    title: "Settings",
    slug: "settings",
    link_to: buildUrl([stem, "settings"]),
  });

  links.push({
    title: "Favourites",
    slug: "favourites",
    link_to: buildUrl([stem, "favourites", firstId(data.favourites)]),
    disabled: data.favourites.length === 0,
  });

  links.push({
    title: "Watchlist",
    slug: "watchlist",
    link_to: buildUrl([stem, "watchlist", firstId(data.watchlist)]),
    disabled: data.watchlist.length === 0,
  });

  links.push({
    title: "Comments",
    slug: "comments",
    link_to: buildUrl([stem, "comments"]),
    disabled: data.comments.length === 0,
  });

  links.push({
    title: "Cart",
    slug: "cart",
    link_to: buildUrl([stem, "cart"]),
    disabled: true,
  });

  links.push({
    title: "Orders",
    slug: "orders",
    link_to: buildUrl([stem, "orders"]),
    disabled: true,
  });

  return <Subnav links={links} />;
};

export { AccountSubnavLoader };
