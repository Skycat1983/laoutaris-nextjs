/**
 * @fileoverview
 * This Next.js server-side route handler manages the `/account/favourites` path.
 *
 * - **Purpose:**
 *   The `Favourites` component serves as a redirect handler for the `/account/favourites` route. Since there is no direct content available at this path,
 *   it ensures that users are automatically redirected to the first available artwork in their favourites (e.g., `/account/favourites/artworkId`).
 *   This prevents users from landing on contentless pages and maintains a seamless navigation experience.
 *
 * - **Project Structure:**
 *   - **Path Pattern:** `/account/favourites/artworkId`
 *   - **Behavior:**
 *     - **Authentication:**
 *       Validates that the user is authenticated. If not, redirects to the homepage.
 *     - **Data Fetching:**
 *       Retrieves the user's favourites from the database using their email address.
 *     - **Redirection:**
 *       - If the favourites list is empty, redirects to the `/account` page.
 *       - If the favourites list contains artworks, redirects to the first artwork's detailed page.
 *
 * - **Error Handling:**
 *   If fetching user data fails or if the favourites list is empty, the component logs the error and redirects the user to the homepage or account dashboard accordingly.
 *   TODO: Implement more granular error handling and user notifications for enhanced user experience.
 *
 * - **Dependencies:**
 *   Utilizes the following utilities and functions:
 *     - `fetchUser`: Fetches user data based on email.
 *     - `buildUrl`: Constructs URLs for redirection.
 *     - `getServerSession`: Retrieves the current user session.
 *     - `redirect`: Performs client-side navigation.
 *     - `dbConnect`: Establishes a connection to the MongoDB database.
 *     - `config`: Accesses configuration variables like `BASEURL`.
 *
 * - **Notes:**
 *   - **Security:**
 *     Ensures that only authenticated users can access the favourites and redirect appropriately to prevent unauthorized access.
 *   - **Data Integrity:**
 *     Assumes that each user has a unique favourites list associated with their email address.
 *   - **Scalability:**
 *     Designed to easily accommodate additional redirection logic if the favourites structure changes or if more complex navigation is required.
 */

import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import config from "@/lib/config";
import { IFrontendUserBase } from "@/lib/client/types/userTypes";
import { fetchUser } from "@/lib/server/user/data-fetching/fetchUser";
import { buildUrl } from "@/utils/buildUrl";
import { redirect } from "next/navigation";

type UserFavouritesResponse = Pick<IFrontendUserBase, "favourites">;

export default async function Favourites() {
  await dbConnect();
  const { BASEURL } = config;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect(BASEURL);
  }

  const email = session.user.email;

  const response = await fetchUser<UserFavouritesResponse>("email", email, [
    "favourites",
  ]);

  if (!response.success) {
    console.error(
      "Failed to fetch user data in account/favourites:",
      response.message
    );
    redirect(BASEURL);
  }

  // if the response is successful and has favourites..
  if (response.data.favourites.length > 0) {
    const firstFavouriteId = response.data.favourites[0];
    const url = buildUrl(["account", "favourites", firstFavouriteId]);
    redirect(url);
  } else {
    const url = buildUrl(["account"]);
    redirect(url);
  }
}
