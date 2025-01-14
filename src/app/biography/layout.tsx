/**
 * @fileoverview
 * Layout component for the `/biography` path in a Next.js application.
 *
 * - **Purpose:**
 *   Fetches and transforms biography article data into navigation links for the `SubNavBar` component,
 *   allowing users to explore various biography articles within a consistent layout.
 *
 * - **Key Features:**
 *   1. Connects to the database and fetches biography articles using `fetchArticles`.
 *   2. Transforms article data into `SubNavBar` links using the `articleToSubNavLink` resolver.
 *   3. Displays navigation links via the `SubNavBar` component with a `Suspense` fallback for loading states.
 *   4. Renders child components for specific biography article pages.
 *
 * - **Path Structure:**
 *   - `/biography`: Root path for the biography section.
 *   - `/biography/:slug`: Displays content for a specific biography article, with navigable links to other articles.
 *
 * - **Dependencies:**
 *   - `fetchAndResolve`: Fetches and transforms raw data.
 *   - `articleToSubNavLink`: Maps article data to navigation links.
 *   - `SubNavBar`: Renders the navigable links.
 *   - `SubNavSkeleton`: Displays a skeleton loader during data fetching.
 *
 * - **Error Handling:**
 *   Displays a fallback loader (`SubNavSkeleton`) while fetching data. Errors during data fetching will
 *   throw exceptions, ensuring clear failure states (future enhancements could include retry mechanisms).
 */

"use server";
import dbConnect from "@/utils/mongodb";
import { fetchArticles } from "@/lib/server/article/data-fetching/fetchArticles";
import React, { Suspense } from "react";
import { delay } from "@/utils/debug";
import SubNavSkeleton from "@/components/skeletons/SubNavSkeleton";
import SubNavBar from "@/components/ui/subnav/SubNavBar";
import { articleToSubNavLink } from "@/utils/resolvers";
import { fetchAndResolve } from "@/possibly_unused/fetchAndResolve";

export default async function BiographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  await delay(2000);
  const resolver = articleToSubNavLink;

  const fetchLinks = fetchAndResolve(
    fetchArticles,
    "section",
    "biography",
    ["title", "slug"],
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
