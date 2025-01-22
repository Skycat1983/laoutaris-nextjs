/**
 * @fileoverview
 * Layout component for the `/biography` route in a Next.js application.
 *
 * - **Purpose:**
 *   Provides a consistent layout for the Biography section, including a sub-navigation bar (`SubNavBar`)
 *   for exploring available biography articles and rendering child components for specific articles.
 *
 * - **Behavior:**
 *   1. Establishes a database connection using `dbConnect`.
 *   2. Fetches and transforms biography data into navigation links via `getBiographySubNavData`.
 *   3. Displays navigation links using the `SubNavBar` component, with a `SubNavSkeleton` fallback during data loading.
 *   4. Renders child components corresponding to specific biography article pages.
 *
 * - **Path Structure:**
 *   - `/biography`: Root path for the Biography section.
 *   - `/biography/:slug`: Displays content for a specific biography article.
 *
 * - **Key Features:**
 *   - **Dynamic Navigation:** Links to all available biography articles are dynamically generated.
 *   - **Suspense Support:** Uses React's `Suspense` to handle loading states for navigation data.
 *   - **Modularity:** Delegates data fetching to `getBiographySubNavData` for improved maintainability and reusability.
 *
 * - **Error Handling:**
 *   - Displays a skeleton loader (`SubNavSkeleton`) during data fetching.
 *   - Relies on Next.js error boundaries (`error.tsx`) for handling unhandled exceptions.
 *   - TODO: Implement enhanced error recovery mechanisms, such as retries or more granular fallback UIs.
 *
 * - **Dependencies:**
 *   - `dbConnect`: Ensures a connection to MongoDB.
 *   - `getBiographySubNavData`: Abstracts the logic for fetching and transforming biography navigation data.
 *   - `SubNavBar`: Renders navigable links to other biography articles.
 *   - `SubNavSkeleton`: Provides a fallback UI for loading states.
 */

"use server";
import dbConnect from "@/utils/mongodb";
import React, { Suspense } from "react";
import { delay } from "@/utils/debug";
import SubNavSkeleton from "@/components/skeletons/SubNavSkeleton";
import SubNavBar from "@/components/ui/subnav/SubNavBar";
import { getBiographySubNavData } from "@/lib/server/article/use_cases/getArticleSubnavData";

export default async function BiographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  // await delay(2000);
  const fetchLinks = getBiographySubNavData;

  return (
    <section>
      <Suspense fallback={<SubNavSkeleton />}>
        <SubNavBar fetchLinks={fetchLinks} />
      </Suspense>
      {children}
    </section>
  );
}
