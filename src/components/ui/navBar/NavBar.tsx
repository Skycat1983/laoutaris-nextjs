/**
 * @fileoverview
 * This Next.js component manages the main navigation bar across the entire website.
 *
 * - **Purpose:**
 *   The `MainNav` component dynamically generates the primary navigation links for the website by fetching the first available
 *   entries from key sections such as Artwork and Biography. This ensures that each main navigation link (e.g., Artwork, Biography)
 *   automatically redirects users to the most relevant and up-to-date content (e.g., `/artwork/collectionSlug/artworkId` or `/biography/early-years`).
 *   By doing so, it prevents users from landing on contentless pages and streamlines navigation throughout the site.
 *
 * - **Project Structure:**
 *   - **Path Pattern:**
 *     - **Artwork:** `/artwork/collectionSlug/artworkId`
 *     - **Biography:** `/biography/articleSlug`
 *     - **Blog:** `/blog/latest`
 *     - **Project:** `/project/about`
 *     - **Shop:** `/shop/all`
 *   - **Behavior:**
 *     - **Dynamic Linking:** Fetches the first available collection or article from specified sections to set default navigation paths.
 *     - **Responsive Design:** Renders different navigation layouts (`MobileNavLayout`, `TabletNavLayout`, `DesktopNavLayout`) based on the device viewport.
 *
 * - **Error Handling:**
 *   TODO: Enhance error handling to include retry mechanisms or fallback navigation links.
 *
 * - **Dependencies:**
 *   Utilizes the following utilities and components:
 *     - `fetchCollections`: Retrieves collections from the MongoDB Collection collection based on specified criteria.
 *     - `fetchArticles`: Retrieves articles from the MongoDB Article collection based on specified criteria.
 *     - `buildUrl`: Constructs URLs based on provided path segments.
 *     - `MobileNavLayout`, `TabletNavLayout`, `DesktopNavLayout`: Render navigation layouts optimized for different device viewports.
 *     - `getServerSession`: Retrieves the current user session (authentication status).
 *
 * - **Notes:**
 *   - **Dynamic Content Prioritization:**
 *     By fetching and using the first entry in each section, any updates to the order or priority of collections/articles in the database
 *     will automatically reflect in the main navigation links.
 *   - **Data Integrity:**
 *     Ensures that each main navigation link points directly to existing and navigable content, enhancing user experience by avoiding dead ends.
 *   - **Scalability:**
 *     The component is designed to easily accommodate additional sections or changes in the website's structure by adjusting the fetch parameters and navigation link configurations.
 */

"use server";

import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { IFrontendCollectionUnpopulated } from "@/lib/client/types/collectionTypes";
import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import { fetchCollections } from "@/lib/server/collection/data-fetching/fetchCollections";
import { fetchArticles } from "@/lib/server/article/data-fetching/fetchArticles";
import { buildUrl } from "@/utils/buildUrl";
import MobileNavLayout from "./MobileNavLayout";
import TabletNavLayout from "./TabletNavLayout";
import DesktopNavLayout from "./DesktopNavLayout";
import { authOptions } from "@/lib/config/authOptions";

export interface NavBarLink {
  label: string;
  path: string;
  disabled?: boolean;
}

type CollectionLink = Pick<
  IFrontendCollectionUnpopulated,
  "title" | "slug" | "artworks"
>;
type BiographyLink = Pick<IFrontendArticle, "slug">;

const NavBar = async () => {
  await dbConnect();
  const session = await getServerSession(authOptions);

  //! Artworks
  const collectionResponse = await fetchCollections<CollectionLink>(
    "section",
    "artwork",
    ["title", "slug", "artworks"]
  );

  const collections = collectionResponse.success ? collectionResponse.data : [];

  const firstCollection = collections[0];
  const collectionSlug = firstCollection.slug;
  const artworkId = firstCollection.artworks[0];
  const artworkPath = buildUrl(["collections", collectionSlug, artworkId]);

  const artworkNavlink: NavBarLink = {
    label: "Collections",
    path: artworkPath,
  };

  // ! Biography
  const biographyResponse = await fetchArticles<BiographyLink>(
    "section",
    "biography",
    ["title", "slug"]
  );
  const biographies = biographyResponse.success ? biographyResponse.data : [];

  const firstBiography = biographies[0];
  const biographySlug = firstBiography.slug;
  const biographyPath = buildUrl(["biography", biographySlug]);

  const biographyNavlink: NavBarLink = {
    label: "Biography",
    path: biographyPath,
  };

  //! Blog
  const blogPath = buildUrl(["blog", "latest"]);
  const blogNavlink: NavBarLink = {
    label: "Blog",
    path: blogPath,
  };

  //! Project
  const projectPath = buildUrl(["project", "about"]);
  const projectNavlink: NavBarLink = {
    label: "Project",
    path: projectPath,
  };

  // ! Shop
  const shopPath = buildUrl(["shop"]);
  const shopNavlink: NavBarLink = {
    label: "Shop",
    path: shopPath,
    disabled: true,
  };

  const navLinks = [
    artworkNavlink,
    biographyNavlink,
    blogNavlink,
    projectNavlink,
    shopNavlink,
  ];

  return (
    <nav className="">
      <div className="block sm:hidden">
        <MobileNavLayout navLinks={navLinks} />
      </div>
      <div className="hidden sm:block lg:hidden">
        <TabletNavLayout navLinks={navLinks} />
      </div>
      <div className="hidden lg:block">
        <DesktopNavLayout navLinks={navLinks} />
      </div>
    </nav>
  );
};

export default NavBar;
