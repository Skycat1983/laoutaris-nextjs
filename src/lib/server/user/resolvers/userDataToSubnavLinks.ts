import { SubNavBarLink } from "@/components/ui/subnav/SubNavBar";
import { PotentialUrl } from "@/lib/types/commonTypes";
// TODO: pass the cart, comments, dashboard objects where this function is called instead

export const buildUserSubnavLinks = (
  favouritePath: PotentialUrl,
  watchlistPath: PotentialUrl
): SubNavBarLink[] => {
  return [
    {
      title: "Dashboard",
      slug: "dashboard",
      link_to: "/account/dashboard",
    },
    {
      title: "Favourites",
      slug: "favourites",
      link_to: favouritePath || "/",
      disabled: !favouritePath,
    },
    {
      title: "Watchlist",
      slug: "watchlist",
      link_to: watchlistPath || "/",
      disabled: !watchlistPath,
    },
    {
      title: "Comments",
      slug: "comments",
      link_to: "/account/comments",
      disabled: true,
    },
    {
      title: "Cart",
      slug: "cart",
      link_to: "/account/cart",
      disabled: true,
    },
  ];
};
