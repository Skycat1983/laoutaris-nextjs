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

import dbConnect from "@/utils/mongodb";
import { IFrontendCollectionUnpopulated } from "@/lib/client/types/collectionTypes";
import { fetchCollections } from "@/lib/server/collection/data-fetching/fetchCollections";
import { buildUrl } from "@/utils/buildUrl";
import SubNavBar from "@/components/ui/subnav/SubNavBar";
import SubNavSkeleton from "@/components/skeletons/SubNavSkeleton";
import { Suspense } from "react";
import SubNav from "@/possibly_unused/SubNav";
import { delay } from "@/utils/debug";
import { collectionToSubNavLink } from "@/utils/resolvers";
import { fetchAndResolve } from "@/possibly_unused/fetchAndResolve";

type SubnavCollectionFields = Pick<
  IFrontendCollectionUnpopulated,
  "title" | "slug" | "artworks"
>;

interface SubNavBarLink {
  title: string;
  slug: string;
  url: string;
  disabled?: boolean;
}

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const resolver = collectionToSubNavLink;

  const fetchLinks = fetchAndResolve(
    fetchCollections,
    "section",
    "artwork",
    ["title", "slug", "artworks"],
    resolver
  );

  return (
    <section>
      <Suspense fallback={<SubNavSkeleton />}>
        <SubNavBar fetchLinks={fetchLinks} />
      </Suspense>
      {children}
    </section>
  );
}

// const resolver = (item: SubnavCollectionFields): SubNavBarLink => ({
//   title: item.title,
//   slug: item.slug,
//   url: buildUrl(["collections", item.slug, item.artworks[0]]),
// });

// const createFetchLinks = (
//   identifierKey: string,
//   identifierValue: string,
//   fields: string[]
// ): (() => Promise<SubNavBarLink[]>) => {
//   return async () => {
//     const response = await fetchCollections<SubnavCollectionFields>(
//       identifierKey,
//       identifierValue,
//       fields
//     );

//     if (response.success) {
//       return response.data.map((item) => ({
//         title: item.title,
//         slug: item.slug,
//         url: buildUrl(["collections", item.slug, item.artworks[0]]),
//       }));
//     }
//     throw new Error("Failed to fetch links");
//   };
// };

// interface SubNavBarLink {
//   title: string;
//   slug: string;
//   url: string;
//   disabled?: boolean;
// }

// type SubnavCollectionFields = Pick<
//   IFrontendCollectionUnpopulated,
//   "title" | "slug" | "artworks"
// >;

// export default async function CollectionsLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   await dbConnect();
//   const stem = "collections";
//   const identifierKey = "section";
//   const identifierValue = "artwork";
//   const fields = ["title", "slug", "artworks"];
//   const fetcher = fetchCollections;
//   const linkResolver = (item: SubnavCollectionFields): SubNavBarLink => ({
//     title: item.title,
//     slug: item.slug,
//     url: buildUrl([stem, item.slug, item.artworks[0]]),
//   });

//   return (
//     <section className="p-0 m-0">
//       <Suspense fallback={<SubNavSkeleton />}>
//         <SubNav
//           fetcher={fetcher}
//           identifierKey={identifierKey}
//           identifierValue={identifierValue}
//           fields={fields}
//           linkResolver={linkResolver}
//         />
//       </Suspense>
//       {children}
//     </section>
//   );
// }

{
  /* <SubNav links={links} /> */
}

// const response = await fetchCollections<SubnavCollectionFields>(
//   identifierKey,
//   identifierValue,
//   fields
// );
// if (!response.success) {
//   return (
//     <section className="p-0 m-0">
//       <p className="mt-4">{response.message}</p>
//       {children}
//     </section>
//   );
// }
// const { data } = response;

// const links = data.map((link) => ({
//   title: link.title,
//   slug: link.slug,
//   url: buildUrl([stem, link.slug, link.artworks[0]]),
// }));
