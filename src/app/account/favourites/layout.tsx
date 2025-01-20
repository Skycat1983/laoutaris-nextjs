/**
 * @fileoverview
 * This Next.js layout component manages the `/account/favourites` path.
 *
 * - **Purpose:**
 *   The `FavouritesLayout` component serves as the main layout for the `/account/favourites` section of the website.
 *   It ensures that only authenticated users can access favourites-related pages by redirecting unauthenticated users to the homepage.
 *   Upon successful authentication, it fetches the user's favourites from the database to facilitate pagination.
 *   The component automatically redirects users to the first artwork in their favourites to prevent landing on a contentless page.
 *
 * - **Project Structure:**
 *   - **Path Pattern:** `/account/favourites/[artworkId]`
 *   - **Behavior:**
 *     - **Authentication:**
 *       Validates that the user is authenticated. If not, redirects to the homepage.
 *     - **Data Fetching:**
 *       Retrieves the authenticated user's favourites, including necessary artwork details such as `secure_url`, `width`, and `height` for image rendering.
 *     - **Redirection:**
 *       - If the favourites list is empty, redirects the user to the main account dashboard (`/account`).
 *       - If the favourites list contains artworks, redirects the user to the first artwork's detailed page (`/account/favourites/artworkId`).
 *
 * - **Error Handling:**
 *   If fetching user data fails or if there are no artworks in the favourites list, the component logs the error and redirects the user to the homepage or account dashboard accordingly.
 *   TODO: Implement more granular error handling and user notifications to enhance the user experience during failures.
 *
 * - **Dependencies:**
 *   Utilizes the following utilities and components:
 *     - `fetchUserFavourites`: Retrieves the user's favourites from the database based on their email.
 *     - `buildUrl`: Constructs URLs based on provided path segments.
 *     - `getServerSession`: Retrieves the current user session for authentication purposes.
 *     - `redirect`: Performs server-side navigation to specified URLs.
 *     - `dbConnect`: Establishes a connection to the MongoDB database.
 *     - `config`: Accesses configuration variables like `BASEURL`.
 *     - `ArtistProfile`, `HorizontalDivider`, `ServerPagination`: Renders UI components with fetched data.
 *
 * - **Notes:**
 *   - **Security:**
 *     Ensures that only authenticated users can access the favourites, preventing unauthorized access.
 *   - **Data Integrity:**
 *     Assumes that each user has a unique favourites list associated with their email address.
 *   - **Scalability:**
 *     Designed to easily accommodate additional features or changes in the favourites structure by adjusting fetch parameters and navigation logic.
 *   - **Performance:**
 *     Efficiently fetches only the necessary fields (`secure_url`, `width`, `height`) to optimize image rendering performance with Next.js's `Image` component.
 */

import ArtistProfile from "@/components/ui/common/ArtistProfile";
import HorizontalDivider from "@/components/ui/common/HorizontalDivider";
import SubscribeForm from "@/components/ui/forms/SubscribeForm";
import config from "@/lib/config";
import { authOptions } from "@/lib/config/authOptions";
import { fetchUserFavourites } from "@/lib/server/user/data-fetching/fetchUserFavourites";
import { FrontendUserWithFavourites } from "@/lib/types/userTypes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function FavouritesLayout({
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
  const userFields = ["favourites"];
  const artworkFields = [
    "_id",
    "image.secure_url",
    "image.pixelHeight",
    "image.pixelWidth",
  ];

  const response = await fetchUserFavourites<FrontendUserWithFavourites>(
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
      <h1 className="px-4 py-6 text-2xl font-bold">More of your favourites</h1>
      {/* <ServerPagination
        stem="account"
        artworkLinks={data.favourites}
        collectionSlug={"favourites"}
      /> */}
      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <h1 className="px-4 py-6 text-2xl font-bold">Your custom collection</h1>
      <p className="px-4 text-primary">
        Artworks you have favourited will appear here. You can add and remove
        artworks from your collection at any time. Meanwhile, your watchlist is
        where you can keep track of artworks or prints you might be interested
        in purchasing. We will notify you by email when any of these artworks
        are available for sale.
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
