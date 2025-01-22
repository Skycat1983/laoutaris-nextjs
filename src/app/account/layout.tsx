/**
 * @fileoverview
 * This Next.js layout component manages the `/account` path, providing authenticated users with access to their dashboard, favourites, and watchlist.
 *
 * - **Purpose:**
 *   The `AccountLayout` component serves as the main layout for the `/account` section of the website. It ensures that only authenticated users can access account-related pages by redirecting unauthenticated users to the homepage. Upon successful authentication, it fetches the user's favourites and watchlist from the database to dynamically generate sub-navigation links. These links allow users to navigate directly to their favourites or watchlist items, with the URLs pointing to the first available item in each category if they exist.
 *
 * - **Project Structure:**
 *   - **Path Pattern:** `/account/[subpage]`
 *   - **Behavior:**
 *     - **Authentication:**
 *       Checks if the user is authenticated. If not, redirects to the homepage.
 *     - **Data Fetching:**
 *       Retrieves the authenticated user's favourites and watchlist from the database.
 *     - **Navigation:**
 *       Constructs sub-navigation links based on the fetched data, automatically directing users to the first item in their favourites or watchlist if available.
 *
 * - **Error Handling:**
 *   - **Authentication Failure:**
 *     Redirects unauthenticated users to the homepage.
 *   - **Data Fetching Failure:**
 *     Logs errors to the console and redirects users to the homepage if fetching user data fails.
 *   - **Empty Favourites or Watchlist:**
 *     Disables the respective navigation links if the user has no favourites or watchlist items.
 *   - **TODO:**
 *     Enhance error handling to provide user-friendly messages and possibly retry mechanisms for transient failures.
 *
 * - **Dependencies:**
 *   Utilizes the following utilities and components:
 *     - `fetchUser`: Retrieves user data from the MongoDB User collection based on the user's email.
 *     - `buildUrl`: Constructs URLs based on provided path segments.
 *     - `getServerSession`: Retrieves the current user session to verify authentication.
 *     - `SubNavBar`: Renders the sub-navigation bar with dynamically generated links.
 *     - `dbConnect`: Establishes a connection to the MongoDB database.
 *
 * - **Notes:**
 *   - **Data Integrity:**
 *     Ensures that the `favourites` and `watchlist` arrays contain valid references before constructing URLs to prevent broken links.
 *   - **Dynamic Navigation:**
 *     Automatically updates the navigation links based on the user's current favourites and watchlist, reflecting any changes in real-time.
 *   - **Scalability:**
 *     Designed to easily accommodate additional sub-navigation links or user-specific data as the application grows.
 */

import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import config from "@/lib/config";
import { fetchUser } from "@/lib/server/user/data-fetching/fetchUser";
import { buildUrl } from "@/utils/buildUrl";
import { redirect } from "next/navigation";
import SubNavBar from "@/components/ui/subnav/SubNavBar";
import { authOptions } from "@/lib/config/authOptions";
import { SubNavBarLink } from "@/lib/resolvers/subnavResolvers";
import { FrontendUserUnpopulated } from "@/lib/types/userTypes";

type UserAccountSubnavOptions = Pick<
  FrontendUserUnpopulated,
  "favourites" | "watchlist"
>;

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const { BASEURL } = config;

  const session = await getServerSession(authOptions);

  // If user is not authenticated, redirect to the homepage
  if (!session?.user?.email) {
    console.log("failed to get session in account layout");
    redirect(BASEURL);
  }

  const email = session.user.email;

  // Fetch user data using Pick for type safety
  const response = await fetchUser<UserAccountSubnavOptions>("email", email, [
    "favourites",
    "watchlist",
  ]);

  if (!response.success) {
    console.error("Failed to fetch user data:", response.message);
    redirect(BASEURL);
  }

  const favourites = response.data.favourites;
  const watchlist = response.data.watchlist;

  const favouritesCount = favourites.length;
  const watchlistCount = watchlist.length;

  // Determine the first favourite and watchlist items if available
  const firstFavouriteSlug = favouritesCount > 0 ? favourites[0] : null;
  const firstWatchlistSlug = watchlistCount > 0 ? watchlist[0] : null;

  // Define the sub-navigation links with dynamic URLs
  const userLinks: SubNavBarLink[] = [
    {
      title: "Dashboard",
      slug: "dashboard",
      link_to: buildUrl(["account", "dashboard"]),
    },
    {
      title: "Favourites",
      slug: "favourites",
      link_to: firstFavouriteSlug
        ? buildUrl(["account", "favourites", firstFavouriteSlug])
        : buildUrl(["account", "favourites"]),
      disabled: favouritesCount === 0, // Disabled if no favourites
    },
    {
      title: "Watchlist",
      slug: "watchlist",
      link_to: firstWatchlistSlug
        ? buildUrl(["account", "watchlist", firstWatchlistSlug])
        : buildUrl(["account", "watchlist"]),
      disabled: watchlistCount === 0, // Disabled if no watchlist items
    },
  ];

  return (
    <section className="p-0 m-0">
      {/* <SubNavBar fetchLinks={userLinks} /> */}
      {children}
    </section>
  );
}

// export default async function AccountLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   await dbConnect();
//   const { BASEURL } = config;

//   const session = await getServerSession(authOptions);

//   // If user is not authenticated, redirect to the homepage
//   if (!session?.user?.email) {
//     console.log("failed to get session in account layout");
//     redirect(BASEURL);
//   }

//   const email = session.user.email;

//   // Fetch user data using Pick for type safety
//   const response = await fetchUser<UserAccountSubnavOptions>("email", email, [
//     "favourites",
//     "watchlist",
//   ]);

//   if (!response.success) {
//     console.error("Failed to fetch user data:", response.message);
//     redirect(BASEURL);
//   }

//   const favourites = response.data.favourites;
//   const watchlist = response.data.watchlist;

//   const favouritesCount = favourites.length;
//   const watchlistCount = watchlist.length;

//   // Determine the first favourite and watchlist items if available
//   const firstFavouriteSlug = favouritesCount > 0 ? favourites[0] : null;
//   const firstWatchlistSlug = watchlistCount > 0 ? watchlist[0] : null;

//   // Define the sub-navigation links with dynamic URLs
//   const userLinks: SubNavBarLink[] = [
//     {
//       title: "Dashboard",
//       slug: "dashboard",
//       link_to: buildUrl(["account", "dashboard"]),
//     },
//     {
//       title: "Favourites",
//       slug: "favourites",
//       link_to: firstFavouriteSlug
//         ? buildUrl(["account", "favourites", firstFavouriteSlug])
//         : buildUrl(["account", "favourites"]),
//       disabled: favouritesCount === 0, // Disabled if no favourites
//     },
//     {
//       title: "Watchlist",
//       slug: "watchlist",
//       link_to: firstWatchlistSlug
//         ? buildUrl(["account", "watchlist", firstWatchlistSlug])
//         : buildUrl(["account", "watchlist"]),
//       disabled: watchlistCount === 0, // Disabled if no watchlist items
//     },
//   ];

//   return (
//     <section className="p-0 m-0">
//       {/* <SubNavBar fetchLinks={userLinks} /> */}
//       {children}
//     </section>
//   );
// }
