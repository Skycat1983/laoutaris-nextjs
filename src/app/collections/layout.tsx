/**
 * @fileoverview
 * This Next.js layout component manages the `/artwork` path.
 *
 * - **Purpose:**
 *   The `ArtworkLayout` component fetches available collections from MongoDB
 *   and passes them to the `SubNavBar` for navigation purposes.
 *
 * - **Project Structure:**
 *   - **Path Pattern:** `/artwork/collection-name/artworkId`
 *   - **Behavior:** Accessing `/artwork` redirects to the first artwork of the first collection.
 *
 * - **Error Handling:**
 *   Currently, if no collections or artworks are found, the `SubNavBar` receives an empty array.
 *   TODO: Implement user-friendly error messages or fallback UI.
 *
 * - **Dependencies:**
 *   Utilizes `fetchCollections` to retrieve collection data and `buildUrl` to construct navigation URLs.
 *   Renders the `SubNavBar` component with the fetched collection links.
 */

import SubNavBar from "@/components/ui/subnav/SubNavBar";
import SubNavSkeleton from "@/components/skeletons/SubNavSkeleton";
import { Suspense } from "react";
import { getCollectionSubNavData } from "@/lib/server/collection/use_cases/getCollectionSubnavData";
import HorizontalDivider from "@/components/ui/atoms/HorizontalDivider";

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetchLinks = getCollectionSubNavData;

  return (
    <section>
      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <h1 className="px-4 py-6 text-2xl font-bold">
        More from this collection
      </h1>
      <Suspense fallback={<SubNavSkeleton />}>
        <SubNavBar fetchLinks={fetchLinks} />
      </Suspense>
      {children}
    </section>
  );
}
