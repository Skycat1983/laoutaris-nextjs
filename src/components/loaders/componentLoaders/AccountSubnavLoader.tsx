import {
  Subnav,
  SubnavLink,
} from "@/components/modules/navigation/subnav/Subnav";
import { fetchUserNavigationList } from "@/lib/api/public/navigationApi";
import { buildUrl } from "@/lib/utils/buildUrl";
import React from "react";

type Props = {};

const firstId = (arr: string[]) => arr[0];

const AccountSubnavLoader = async () => {
  const result = await fetchUserNavigationList();
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

  // Favourites link
  links.push({
    title: "Favourites",
    slug: "favourites",
    link_to: buildUrl([stem, "favourites", firstId(data.favourites)]),
    disabled: data.favourites.length === 0,
  });

  // Watchlist link
  links.push({
    title: "Watchlist",
    slug: "watchlist",
    link_to: buildUrl([stem, "watchlist", firstId(data.watchlist)]),
    disabled: data.watchlist.length === 0,
  });

  // Comments link
  links.push({
    title: "Comments",
    slug: "comments",
    link_to: buildUrl([stem, "comments", firstId(data.comments)]),
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

export default AccountSubnavLoader;
