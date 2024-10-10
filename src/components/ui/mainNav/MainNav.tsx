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

// ? the fetchs below ensure that the default sublink is always the first one in the list, ensuring that any changes to priority status our collections or articles will be reflected in the nav

interface NavLink {
  label: string;
  path: string;
}

type CollectionLink = Pick<
  IFrontendCollectionUnpopulated,
  "title" | "slug" | "artworks"
>;
type BiographyLink = Pick<IFrontendArticle, "slug">;

const MainNav = async () => {
  await dbConnect();
  const session = await getServerSession();
  console.log("session in MAIN NAV:>> ", session);

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
  const artworkPath = buildUrl(["artwork", collectionSlug, artworkId]);

  const artworkNavlink: NavLink = {
    label: "Artwork",
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

  const biographyNavlink: NavLink = {
    label: "Biography",
    path: biographyPath,
  };

  //! Blog
  const blogPath = buildUrl(["blog", "latest"]);
  const blogNavlink: NavLink = {
    label: "Blog",
    path: blogPath,
  };

  //! Project
  const projectPath = buildUrl(["project", "about"]);
  const projectNavlink: NavLink = {
    label: "Project",
    path: projectPath,
  };

  // ! Shop
  const shopPath = buildUrl(["shop", "all"]);
  const shopNavlink: NavLink = {
    label: "Shop",
    path: shopPath,
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

export default MainNav;
