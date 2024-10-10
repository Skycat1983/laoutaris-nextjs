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
 *   Utilizes `fetchBiographyFields` to retrieve biography data from MongoDB and constructs URLs for navigation.
 *   Renders the `SubNavBar` component with the fetched biography links.
 */

import dbConnect from "@/utils/mongodb";
import { fetchBiographyFields } from "@/lib/server/biography/data-fetching/fetchBiographyFieldsOld";
import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import SubNavBar from "@/components/ui/subnav/SubNavBar";

type ArticleRedirectLink = Pick<IFrontendArticle, "title" | "slug">;

export default async function BiographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const stem = "biography";

  const response = await fetchBiographyFields<ArticleRedirectLink>(stem, [
    "title slug",
  ]);
  if (!response.success) {
    return (
      <section className="p-0 m-0">
        <p className="mt-4">{response.message}</p>
        {children}
      </section>
    );
  }

  const { data } = response;

  const links = data.map((link) => ({
    title: link.title,
    slug: link.slug,
    url: `/${stem}/${link.slug}`,
  }));

  return (
    <section>
      <SubNavBar links={links} />
      {children}
    </section>
  );
}
