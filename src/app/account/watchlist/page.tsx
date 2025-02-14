/**
 * @fileoverview
 * This Next.js server-side route handler manages the `/account/watchlist` path.
 *
 * - **Purpose:**
 *   The `Watchlist` component serves as a redirect handler for the `/account/watchlist` route. Since there is no direct content available at this path,
 *   it ensures that users are automatically redirected to the first available artwork in their watchlist (e.g., `/account/watchlist/artworkId`).
 *   This prevents users from landing on contentless pages and maintains a seamless navigation experience.
 *
 * - **Project Structure:**
 *   - **Path Pattern:** `/account/watchlist/artworkId`
 *   - **Behavior:**
 *     - **Authentication:**
 *       Validates that the user is authenticated. If not, redirects to the homepage.
 *     - **Data Fetching:**
 *       Retrieves the user's watchlist from the database using their email address.
 *     - **Redirection:**
 *       - If the watchlist is empty, redirects to the `/account` page.
 *       - If the watchlist contains artworks, redirects to the first artwork's detailed page.
 *
 * - **Error Handling:**
 *   If fetching user data fails or if the watchlist is empty, the component logs the error and redirects the user to the homepage or account dashboard accordingly.
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
 *     Ensures that only authenticated users can access the watchlist and redirect appropriately to prevent unauthorized access.
 *   - **Data Integrity:**
 *     Assumes that each user has a unique watchlist associated with their email address.
 *   - **Scalability:**
 *     Designed to easily accommodate additional redirection logic if the watchlist structure changes or if more complex navigation is required.
 */

import dbConnect from "@/lib/db/mongodb";
import { redirect } from "next/navigation";
import { getUserWatchlistArtworkDefaultPath } from "@/lib/old_code/user/use_cases/getUserWatchlistArtworkDefaultPath";

export default async function Watchlist() {
  await dbConnect();
  const defaultPath = await getUserWatchlistArtworkDefaultPath();
  const url = defaultPath ? `${defaultPath}` : "/";
  return redirect(url);
}
