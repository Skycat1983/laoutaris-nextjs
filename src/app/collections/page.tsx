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

import { getCollectionDefaultPath } from "@/lib/server/collection/use_cases/getCollectionDefaultPath";
import { redirect } from "next/navigation";

export default async function Collections() {
  const defaultRedirectPath = await getCollectionDefaultPath();
  return redirect(defaultRedirectPath);
}
