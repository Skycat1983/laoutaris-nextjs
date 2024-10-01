"use server";

import MobileNavLayout from "./MobileNavLayout";
import TabletNavLayout from "./TabletNavLayout";
import DesktopNavLayout from "./DesktopNavLayout";
import { fetchCollectionLinks } from "@/lib/server/collection/data-fetching/fetchCollectionLinks";
import { fetchBiographyLinks } from "@/lib/server/biography/data-fetching/fetchBiographyLinks";
import dbConnect from "@/utils/mongodb";
import { fetchArtworkLinks } from "@/lib/server/artwork/data-fetching/fetchArtworkLinks";
import { fetchBiographyFields } from "@/lib/server/biography/data-fetching/fetchBiographyFields";
import { fetchCollectionFields } from "@/lib/server/collection/data-fetching/fetchCollectionFields";

// ? the fetchs below ensure that the default sublink is always the first one in the list, ensuring that any changes to priority status our collections or articles will be reflected in the nav

interface Links {
  title: string;
  slug: string;
}

const MainNav = async () => {
  await dbConnect();

  // ! Collection
  const collectionResponse = await fetchCollectionFields<Links>("artwork", [
    "title",
    "slug",
  ]);
  const { data: availableCollectionLinks } = collectionResponse.success
    ? collectionResponse
    : { data: [] };

  // Create the default link for artwork
  const defaultCollectionSublinkHref =
    availableCollectionLinks.length > 0
      ? `${availableCollectionLinks[0].slug}/${availableCollectionLinks[0].slug}`
      : "";

  // Define navigation links using the fetched data
  const artworkNavlink = {
    label: "Artwork",
    path: `http://localhost:3000/artwork/${defaultCollectionSublinkHref}`,
  };

  // ! Biography
  const biographyResponse = await fetchBiographyFields<Links>("biography", [
    "title",
    "slug",
  ]);
  const { data: availableBiographyLinks } = biographyResponse.success
    ? biographyResponse
    : { data: [] };

  // Create the default link for biography
  const defaultBiographySublinkHref =
    availableBiographyLinks.length > 0 ? availableBiographyLinks[0].slug : "";

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

  // console.log("defaultBiographySublink", defaultBiographySublinkHref);
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

// //! Collection
// const collectionLinks = await fetchCollectionLinks("artwork");
// const { data: availableCollectionLinks } = collectionLinks.success
//   ? collectionLinks
//   : { data: [] };
// const defaultCollectionSublinkHref = `${availableCollectionLinks[0].slug}/${availableCollectionLinks[0].defaultRedirect}`;

// const artworkNavlink = {
//   label: "Artwork",
//   path: `http://localhost:3000/artwork/${defaultCollectionSublinkHref}`,
//   // path: `http://localhost:3000/artwork/${defaultCollectionSublinkHref}/${defaultArtworkSublinkHref}`,
// };

// //! Biography
// const biographyArticleLinks = await fetchBiographyLinks("biography");
// const { data: availableBiographyLinks } = biographyArticleLinks.success
//   ? biographyArticleLinks
//   : { data: [] };
// const defaultBiographySublinkHref = availableBiographyLinks[0].slug;
// const biographyNavlink = {
//   label: "Biography",
//   path: `http://localhost:3000/biography/${defaultBiographySublinkHref}`,
// };

//! Artwork
// ? Unused as we now redirect to a default collection/artworkId page
// const artworkLinks = await fetchArtworkLinks(defaultCollectionSublinkHref);
// const { data: availableArtworkLinks } = artworkLinks.success
//   ? artworkLinks
//   : { data: [] };
// const defaultArtworkSublinkHref = availableArtworkLinks[0].id;
