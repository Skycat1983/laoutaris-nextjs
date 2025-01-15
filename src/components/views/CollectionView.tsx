"use client";

import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import ArtworkInfoCard from "@/components/cards/artworkInfoCard/ArtworkInfoCard";
import Pagination from "@/components/ui/headlessPagination/Pagination";
import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import Image from "next/image";
import { useCallback, useState } from "react";

interface CollectionProps {
  watchlist: string[];
  collection: {
    artworks: IFrontendArtwork[];
  };
}

const CollectionView: React.FC<CollectionProps> = ({
  collection,
  watchlist = [],
}) => {
  const [isShowing, setIsShowing] = useState(true);
  const [displayedArtwork, setDisplayedArtwork] = useState<IFrontendArtwork>(
    collection.artworks[0]
  );

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

  const isWatchlisted = (watchlist: string[], id: string) => {
    return watchlist.includes(id);
  };

  return (
    <div className="container mx-auto flex flex-col justify-start w-full  bg-black/10">
      <div className=" bg-blue-100 w-full grid gap-10 lg:grid-cols-2 lg:gap-0 ">
        {displayedArtwork && (
          <>
            {/* image */}
            <div className="flex flex-row  align-start h-auto max-h-[75vh] justify-center lg:justify-end  overflow-none bg-red-100">
              <div className="flex flex-col bg-green-100">
                <Image
                  src={displayedArtwork.image.secure_url}
                  alt="Artwork Title"
                  height={displayedArtwork.image.pixelHeight}
                  width={displayedArtwork.image.pixelWidth}
                  className="max-h-full w-auto max-w-[90vw] object-contain self-start"
                />
              </div>
            </div>
            {/* card */}
            <div className="mx-auto flex justify-center w-2/3 lg:w-full lg:justify-end h-auto overflow-none bg-blue-100">
              <ArtworkInfoCard
                watchlisted={isWatchlisted(watchlist, displayedArtwork._id)}
                {...displayedArtwork}
              />
            </div>
          </>
        )}
      </div>
      <div className="pb-8">
        <HorizontalDivider />
      </div>
      {collection.artworks.length > 1 && (
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
      )}
      <div className="py-8">
        <HorizontalDivider />
      </div>
    </div>
  );
};

export default CollectionView;
