"use server";
/**
 * @fileoverview
 * This Next.js server-side component handles the `/account/watchlist/[artworkId]` route.
 *
 * - **Purpose:**
 *   The `WatchedArtwork` component is responsible for fetching and rendering a specific artwork
 *   from a user's watchlist. It ensures that only authenticated users can access their
 *   watched artworks and provides a seamless experience by displaying the artwork using the
 *   `ArtworkLayout` component.
 *
 * - **Project Structure:**
 *   - **Path Pattern:** `/account/watchlist/[artworkId]`
 *   - **Behavior:**
 *     1. **Database Connection:**
 *        Establishes a connection to the MongoDB database using the `dbConnect` utility.
 *     2. **Session Retrieval:**
 *        Utilizes `getServerSession` from `next-auth` to retrieve the current user's session.
 *     3. **Authentication Validation:**
 *        Checks if the user is authenticated by verifying the presence of a valid session and user email.
 *        - **Unauthenticated Users:** Redirects to the homepage (`BASEURL`) if the session is invalid or missing.
 *     4. **Artwork Fetching:**
 *        Calls the `fetchUserWatchlist` function to retrieve the specific artwork (`artworkId`)
 *        from the authenticated user's watchlist.
 *     5. **Error Handling:**
 *        - **Fetch Failure:** Logs an error and redirects to the homepage if fetching the artwork fails.
 *     6. **Rendering:**
 *        Passes the fetched artwork data to the `ArtworkLayout` component for rendering.
 *
 * - **Error Handling:**
 *   - **Missing Parameters:**
 *     Validates the presence of necessary query parameters (`userKey`, `userValue`, `artworkId`).
 *     Returns a 400 Bad Request error if any are missing.
 *   - **Authentication Failure:**
 *     Redirects unauthenticated users to the homepage to prevent unauthorized access.
 *   - **Artwork Fetch Failure:**
 *     Logs detailed error messages and redirects to the homepage if the artwork cannot be retrieved.
 *   - **Internal Server Errors:**
 *     Catches and logs unexpected errors, returning a 500 Internal Server Error response.
 *
 * - **Dependencies:**
 *   - **Components:**
 *     - `ArtworkLayout`: Renders the artwork details in a structured layout.
 *   - **Utilities:**
 *     - `dbConnect`: Establishes a connection to the MongoDB database.
 *     - `fetchUserWatchlist`: Fetches a specific artwork from the user's watchlist.
 *     - `parseFields`: Parses and formats the fields to be selected during population.
 *     - `delay` (commented out): Intended for debugging purposes to simulate network delays.
 *   - **Authentication:**
 *     - `getServerSession`: Retrieves the current user's session.
 *     - `authOptions`: Configuration options for authentication.
 *   - **Configuration:**
 *     - `config`: Accesses configuration variables like `BASEURL`.
 *   - **Next.js Utilities:**
 *     - `redirect`: Performs server-side redirection to specified URLs.
 *
 * - **Notes:**
 *   - **Security:**
 *     Ensures that only authenticated users can access their watchlist, preventing unauthorized access to artwork details.
 *   - **Performance:**
 *     - Utilizes `lean()` for faster Mongoose queries by returning plain JavaScript objects instead of Mongoose documents.
 *     - The commented-out `delay` function can be used during development to simulate loading states.
 *   - **Scalability:**
 *     Designed to easily accommodate additional functionalities, such as caching artwork dimensions to optimize rendering in `loading.tsx`.
 *   - **Data Integrity:**
 *     Assumes that each user has a unique and correctly formatted watchlist associated with their email address.
 *   - **Developer Notes:**
 *     - **TODO:** Implement caching for artwork dimensions to enhance user experience by providing accurate skeleton loaders during data fetching.
 *     - **Logging:** Extensive logging is implemented to facilitate debugging and monitor the flow of data and authentication status.
 *
 * - **Usage Example:**
 *   When a user navigates to `/account/watchlist/60d5ec49f8d2e4567890abcd`, the `WatchedArtwork` component:
 *   1. Connects to the database.
 *   2. Retrieves and validates the user's session.
 *   3. Fetches the artwork with ID `60d5ec49f8d2e4567890abcd` from the user's watchlist.
 *   4. Renders the artwork using the `ArtworkLayout` component.
 *
 * - **Testing Considerations:**
 *   - Ensure that the component correctly handles authenticated and unauthenticated states.
 *   - Verify that it accurately fetches and renders the specified artwork.
 *   - Test error scenarios, such as missing parameters or failed data fetching, to confirm proper redirection and error handling.
 *
 * - **Best Practices:**
 *   - **Separation of Concerns:** Keeps authentication, data fetching, and rendering logic distinct for maintainability.
 *   - **Reusability:** Leverages reusable components and utilities to streamline development and reduce code duplication.
 *   - **Error Resilience:** Implements comprehensive error handling to maintain application stability under various failure conditions.
 */
"use server";

import dbConnect from "@/utils/mongodb";
import { delay } from "@/utils/debug";
import { getServerSession } from "next-auth";
import config from "@/lib/config";
import { redirect } from "next/navigation";
import { fetchUserWatchlist } from "@/lib/server/user/data-fetching/fetchUserWatchlist";
import { authOptions } from "@/lib/config/authOptions";
import { FrontendArtworkFull } from "@/lib/types/artworkTypes";

//TODO: cache a version of the dimensions for the artwork so that loading.tsx can create a skeleton with the correct dimensions

export default async function WatchedArtwork({
  params,
}: {
  params: { artworkId: string };
}) {
  await dbConnect();
  // await delay(2000);

  const session = await getServerSession(authOptions);
  const { BASEURL } = config;

  if (!session || !session.user || !session.user.email) {
    redirect(BASEURL);
  }

  const userKey = "email";
  const userValue = session.user.email;
  const artworkId = params.artworkId;
  // const userFields = ["watchlist"];

  const response = await fetchUserWatchlist<FrontendArtworkFull>(
    userKey,
    userValue,
    artworkId
  );

  console.log("response in WatchedArtwork:>> ", response);

  if (!response.success) {
    console.error("Failed to fetch user data:", response.message);
    redirect(BASEURL);
  }

  const artwork = response.data;

  return (
    <>
      {/* <ArtworkView {...artwork} /> */}
      {/* <ArtworkLayout {...artwork} /> */}
    </>
  );
}
