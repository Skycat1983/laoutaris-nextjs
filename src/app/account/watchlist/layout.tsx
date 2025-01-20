/**
 * @fileoverview
 * This Next.js layout component manages the `/account/watchlist` path.
 *
 * - **Purpose:**
 *   The `WatchlistLayout` component serves as the main layout for the `/account/watchlist` section of the website.
 *   It ensures that only authenticated users can access watchlist-related pages by redirecting unauthenticated users to the homepage.
 *   Upon successful authentication, it fetches the user's watchlist from the database to facilitate pagination.
 *   The component automatically redirects users to the first artwork in their watchlist to prevent landing on a contentless page.
 *
 * - **Project Structure:**
 *   - **Path Pattern:** `/account/watchlist/[artworkId]`
 *   - **Behavior:**
 *     - **Authentication:**
 *       Validates that the user is authenticated. If not, redirects to the homepage.
 *     - **Data Fetching:**
 *       Retrieves the authenticated user's watchlist, including necessary artwork details such as `secure_url`, `width`, and `height` for image rendering.
 *     - **Redirection:**
 *       - If the watchlist is empty, redirects the user to the main account dashboard (`/account`).
 *       - If the watchlist contains artworks, redirects the user to the first artwork's detailed page (`/account/watchlist/artworkId`).
 *
 * - **Error Handling:**
 *   If fetching user data fails or if there are no artworks in the watchlist, the component logs the error and redirects the user to the homepage or account dashboard accordingly.
 *   TODO: Implement more granular error handling and user notifications to enhance the user experience during failures.
 *
 * - **Dependencies:**
 *   Utilizes the following utilities and components:
 *     - `fetchUserWatchlist`: Retrieves the user's watchlist from the database based on their email.
 *     - `buildUrl`: Constructs URLs based on provided path segments.
 *     - `getServerSession`: Retrieves the current user session for authentication purposes.
 *     - `redirect`: Performs server-side navigation to specified URLs.
 *     - `dbConnect`: Establishes a connection to the MongoDB database.
 *     - `config`: Accesses configuration variables like `BASEURL`.
 *     - `ArtistProfile`, `HorizontalDivider`, `ServerPagination`: Renders UI components with fetched data.
 *
 * - **Notes:**
 *   - **Security:**
 *     Ensures that only authenticated users can access the watchlist, preventing unauthorized access.
 *   - **Data Integrity:**
 *     Assumes that each user has a unique watchlist associated with their email address.
 *   - **Scalability:**
 *     Designed to easily accommodate additional features or changes in the watchlist structure by adjusting fetch parameters and navigation logic.
 *   - **Performance:**
 *     Efficiently fetches only the necessary fields (`secure_url`, `width`, `height`) to optimize image rendering performance with Next.js's `Image` component.
 */

import { getServerSession } from "next-auth";
import config from "@/lib/config";
import ArtistProfile from "@/components/ui/common/ArtistProfile";
import HorizontalDivider from "@/components/ui/common/HorizontalDivider";
import { fetchUserWatchlists } from "@/lib/server/user/data-fetching/fetchUserWatchlists";
import { authOptions } from "@/lib/config/authOptions";
import { redirect } from "next/navigation";
import { FrontendUserWithWatcherlist } from "@/lib/types/userTypes";

// type SelectedUserFields = Pick<IFrontendUserType, "watchlist">;
// type SelectedArtworkFields = Pick<IFrontendArtwork, "image" | "_id">;
// type UserWatchlist = SelectedUserFields & {
//   watchlist: SelectedArtworkFields[];
// };

export default async function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const { BASEURL } = config;

  if (!session || !session.user || !session.user.email) {
    redirect(BASEURL);
  }

  const userKey = "email";
  const userValue = session.user.email;
  const userFields = ["watchlist"];
  const artworkFields = [
    "_id",
    "image.secure_url",
    "image.pixelHeight",
    "image.pixelWidth",
  ];

  const response = await fetchUserWatchlists<FrontendUserWithWatcherlist>(
    userKey,
    userValue,
    userFields,
    artworkFields
  );

  if (!response.success) {
    console.error("Failed to fetch user data:", response.message);
    redirect(BASEURL);
  }

  const { data } = response;

  return (
    <section className="">
      {children}
      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <h1 className="px-4 py-6 text-2xl font-bold">More from your watchlist</h1>
      {/* <ServerPagination
        stem="account"
        artworkLinks={data.watchlist}
        collectionSlug={"watchlist"}
      /> */}
      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <h1 className="px-4 py-6 text-2xl font-bold">Your watchlist</h1>
      <p className="px-4 text-primary">
        Artworks you have watchlisted will appear here. You can add and remove
        artworks from your collection at any time. The purpose of this
        collection is as a place where you can keep track of artworks or prints
        you might be interested in purchasing. We will notify you by email when
        any of these artworks are available for sale.
      </p>
      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <div className="bg-slate-800/10 w-full">
        <ArtistProfile />
      </div>
      <div className="px-4 py-4">
        <HorizontalDivider />
      </div>
      <div className="px-4 py-4">
        <HorizontalDivider />
      </div>
    </section>
  );
}
