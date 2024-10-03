"use server";

import MobileNavLayout from "./MobileNavLayout";
import TabletNavLayout from "./TabletNavLayout";
import DesktopNavLayout from "./DesktopNavLayout";
import dbConnect from "@/utils/mongodb";
import { fetchBiographyFields } from "@/lib/server/biography/data-fetching/fetchBiographyFields";
import { fetchCollectionFields } from "@/lib/server/collection/data-fetching/fetchCollectionFields";

// ? the fetchs below ensure that the default sublink is always the first one in the list, ensuring that any changes to priority status our collections or articles will be reflected in the nav

interface Links {
  title: string;
  slug: string;
}

interface ArtworkLink extends Links {
  artworks: string[];
}

const MainNav = async () => {
  await dbConnect();

  //! Artworks
  const collectionResponse = await fetchCollectionFields<ArtworkLink>(
    "artwork",
    ["title", "slug", "artworks"]
  );
  const { data: availableCollectionLinks } = collectionResponse.success
    ? collectionResponse
    : { data: [] };

  const defaultCollectionSublinkHref =
    availableCollectionLinks.length > 0 &&
    availableCollectionLinks[0].artworks?.length > 0
      ? `${availableCollectionLinks[0].slug}/${availableCollectionLinks[0].artworks[0]}`
      : "";

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
