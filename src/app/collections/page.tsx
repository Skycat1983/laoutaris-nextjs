/**
 * @fileoverview
 * This Next.js page manages the base `/artwork` path.
 *
 * - **Purpose:**
 *   The `/artwork` route serves as an entry point without direct content.
 *   When accessed, it automatically redirects users to the first artwork of the first collection.
 *
 * - **Project Structure:**
 *   - **Path Pattern:** `/artwork/collection-name/artworkId`
 *   - **Behavior:** Accessing `/artwork` forwards to `/artwork/family-favourites/661fd1d940f59e26cc761f00` (example).
 *
 * - **Error Handling:**
 *   If no collections or artworks are available, it displays a message.
 *
 * - **Dependencies:**
 *   Utilizes `fetchCollections` to retrieve collection data and `buildUrl` for constructing redirect URLs.
 */

import { getCollectionRedirect } from "@/lib/use_cases/getCollectionRedirect";

export default async function Collections() {
  return getCollectionRedirect();
}

// const subNavData = await getCollectionSubNavData();

// if (!subNavData || subNavData.length === 0) {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-24">
//       <h1 className="text-3xl font-bold">Artwork</h1>
//       <p className="mt-4">No artworks are available at the moment.</p>
//     </main>
//   );
// }

// const redirectUrl = subNavData[0].link_to;
// redirect(redirectUrl);
