"use server";

import MobileNavLayout from "./MobileNavLayout";
import TabletNavLayout from "./TabletNavLayout";
import DesktopNavLayout from "./DesktopNavLayout";
import { fetchCollectionLinks } from "@/lib/server/collection/data-fetching/fetchCollectionLinks";
import { fetchBiographyLinks } from "@/lib/server/biography/data-fetching/fetchBiographyLinks";
import dbConnect from "@/utils/mongodb";

const MainNav = async () => {
  await dbConnect();

  //! Artwork
  const artworkCollectionLinks = await fetchCollectionLinks("artwork");
  const { data: availableCollectionLinks } = artworkCollectionLinks.success
    ? artworkCollectionLinks
    : { data: [] };
  const defaultCollectionSublinkHref = availableCollectionLinks[0].slug;
  const artworkNavlink = {
    label: "Artwork",
    path: `http://localhost:3000/artwork/${defaultCollectionSublinkHref}`,
  };

  //! Biography
  const biographyArticleLinks = await fetchBiographyLinks("biography");
  const { data: availableBiographyLinks } = biographyArticleLinks.success
    ? biographyArticleLinks
    : { data: [] };
  const defaultBiographySublinkHref = availableBiographyLinks[0].slug;
  const biographyNavlink = {
    label: "Biography",
    path: `http://localhost:3000/biography/${defaultBiographySublinkHref}`,
  };

  //! Blog
  const defaultBlogSublink = "latest";
  const blogNavlink = {
    label: "Blog",
    path: `http://localhost:3000/blog/${defaultBlogSublink}`,
  };

  //! Project
  const defaultProjectSublink = "";
  const projectNavlink = {
    label: "Project",
    path: `http://localhost:3000/project/${defaultProjectSublink}`,
  };

  // ! Shop

  const defaultShopSublink = "";
  const shopNavlink = {
    label: "Shop",
    path: `http://localhost:3000/shop/${defaultShopSublink}`,
  };

  const navLinks = [
    artworkNavlink,
    biographyNavlink,
    blogNavlink,
    projectNavlink,
    shopNavlink,
  ];

  console.log("defaultBiographySublink", defaultBiographySublinkHref);
  return (
    <nav>
      <div className="block sm:hidden">
        <MobileNavLayout />
      </div>
      <div className="hidden sm:block lg:hidden">
        <TabletNavLayout />
      </div>
      <div className="hidden lg:block">
        <DesktopNavLayout navLinks={navLinks} />
      </div>
    </nav>
  );
};

export default MainNav;
