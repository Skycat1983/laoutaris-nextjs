import { ArtistProfile } from "@/components/modules/cards/ArtistProfile";
import React from "react";
import {
  CollectionMagazineCard,
  CollectionMagazineCard2,
  CollectionMagazineCard3,
  CollectionMagazineCard3b,
  CollectionMagazineCard4,
} from "@/components/modules/cards/CollectionMagazineCards";
import { TabbedCollectionInfo } from "@/components/modules/CollectionInfoVariations";
import BlogSectionHeading from "@/components/elements/typography/BlogSectionHeading";
interface CollectionInfoProps {
  title: string;
  subtitle?: string;
  artworkCount?: number;
  imageUrl?: string;
}

// Defau
const defaultProps: CollectionInfoProps = {
  title: "Solitude and Shadows",
  subtitle:
    "A retrospective of Joseph Laoutaris's most influential works. These works are a collection of paintings that were created by Joseph Laoutaris in his lifetime. We have a collection of 24 works that were created by Joseph Laoutaris in his lifetime.",
  artworkCount: 24,
  imageUrl:
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1739636813/artwork/rgdz07hgljrjdj3ne7mv.jpg",
};

const CollectionInfoLayout = () => {
  const url =
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1740658725/assets/Screenshot_2025-01-20_at_16.01.59_hyzndr.png";
  return (
    <>
      <BlogSectionHeading heading="Collection info" />
      <div className="flex flex-row w-full justify-center">
        <div className="flex flex-row justify-center gap-16">
          <div className="w-1/3">
            <CollectionMagazineCard4 {...defaultProps} />
          </div>
          <div className="w-1/3">
            <ArtistProfile imageUrl={url} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionInfoLayout;

{
  /* <TabbedCollectionInfo {...defaultProps} /> */
}
