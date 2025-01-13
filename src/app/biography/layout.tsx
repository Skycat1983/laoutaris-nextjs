/**
 * @fileoverview
 * This Next.js layout component manages the `/biography` path.
 *
 * - **Purpose:**
 *   The `BiographyLayout` component fetches available biography articles from MongoDB and transforms them into navigable links.
 *   These links are then passed to the `SubNavBar` component to facilitate easy navigation between different biography articles.
 *   The layout also renders the child components within the `/biography` path, ensuring consistent layout structure.
 *
 * - **Project Structure:**
 *   - **Path Pattern:** `/biography/articleSlug`
 *   - **Behavior:**
 *     - **Direct Access:** Although the `/biography` path is intended to redirect to a specific biography article, this layout ensures that any additional biography articles are accessible via the `SubNavBar`.
 *     - **Navigation:** Users can navigate between different biography articles using the links provided in the `SubNavBar`.
 *
 * - **Error Handling:**
 *   If fetching biography data fails, the component displays an error message to inform the user.
 *   TODO: Enhance error handling to provide more detailed feedback and possibly retry mechanisms.
 *
 * - **Dependencies:**
 *   Utilizes `fetchArticles` to retrieve biography data from MongoDB and constructs URLs for navigation.
 *   Renders the `SubNavBar` component with the fetched biography links.
 */

"use server";
import dbConnect from "@/utils/mongodb";
import { fetchArticles } from "@/lib/server/article/data-fetching/fetchArticles";
import React, { Suspense } from "react";
import { delay } from "@/utils/debug";
import SubNavSkeleton from "@/components/ui/subnav/SubNavSkeleton";
import { buildUrl } from "@/utils/buildUrl";
import { IFrontendArticle } from "@/lib/client/types/articleTypes";
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

// const resolver = (item: SubNavArticleFields): SubNavBarLink => ({
//   title: item.title,
//   slug: item.slug,
//   url: buildUrl(["biography", item.slug]),
// });

// interface SubNavBarLink {
//   title: string;
//   slug: string;
//   url: string;
//   disabled?: boolean;
// }

// type SubNavArticleFields = Pick<IFrontendArticle, "title" | "slug">;

{
  /* <SubNav
          fetcher={fetcher}
          identifierKey={identifierKey}
          identifierValue={identifierValue}
          fields={fields}
        /> */
}
// type ArticleRedirectLink = Pick<IFrontendArticle, "title" | "slug">;

// const response: ApiResponse<ArticleRedirectLink[]> =
//   await fetchArticles<ArticleRedirectLink>("section", "biography", [
//     "title",
//     "slug",
//   ]);

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
//   url: `/${stem}/${link.slug}`,
// }));

{
  /* <SubNavBar links={links} /> */
}

{
  /* <SubNavSkeleton /> */
}
