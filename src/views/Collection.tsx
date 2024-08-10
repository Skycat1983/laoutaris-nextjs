"use client";

import ArtworkImage from "@/components/animations/ArtworkImage";
import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import ArtworkInfoCard from "@/components/cards/artworkInfoCard/ArtworkInfoCard";
import { IFrontendArtwork } from "@/lib/types/artwork";
import { useCallback, useEffect, useState } from "react";

interface CollectionProps {
  collection: {
    artworks: IFrontendArtwork[];
    // slug: string;
  };
}

const Collection: React.FC<CollectionProps> = ({ collection }) => {
  const [isShowing, setIsShowing] = useState(true);
  const [displayedArtwork, setDisplayedArtwork] =
    useState<IFrontendArtwork | null>(null);

  console.log("collection :>> ", collection);

  const handlePageChange = useCallback(
    (page: number) => {
      setIsShowing(false);

      setTimeout(() => {
        setDisplayedArtwork(collection.artworks[page - 1]);
        setTimeout(() => {
          setIsShowing(true);
        }, 300);
      }, 300);
    },
    [collection.artworks]
  );

  // Initially display the first artwork
  useEffect(() => {
    handlePageChange(1);
  }, [handlePageChange]);

  return (
    <div className="flex flex-col">
      <div className="grid min-h-screen w-full p-x-8 grid-rows-0 lg:grid-cols-2 grid-rows-0">
        {displayedArtwork && (
          <>
            <ArtworkImage
              src={displayedArtwork.image.secure_url}
              alt="Artwork Title"
              isShowing={isShowing}
            />
            <ArtworkInfoCard {...displayedArtwork} />
          </>
        )}
      </div>
      <div className="py-8">
        <HorizontalDivider />
      </div>
      {/* {collection.artworks.length > 1 && (
          <div className="flex flex-row w-full justify-center py-8 h-[400px]">
            <Pagination
              totalPages={collection.artworks.length}
              handlePageChange={handlePageChange}
              pageRangeDisplayed={collection.artworks.length}
              showFirstLast={false}
              showPrevNext={true}
              paginationItems={collection.artworks}
            />
          </div>
        )} */}
      <div className="py-8">
        <HorizontalDivider />
      </div>
    </div>
  );
};

export default Collection;
