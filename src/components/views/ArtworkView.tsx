import { PublicArtwork } from "@/lib/transforms/artworkToPublic";
import { ArtworkInfoCard } from "../modules/cards/ArtworkInfoCard";

import { MagnifierImage } from "../modules/MagnifierImage";
import CollectionInfoLayout from "../layouts/public/CollectionInfoLayout";

const ArtworkView = (artwork: PublicArtwork) => {
  const Card = () => {
    // TODO: maybe have ArtworkInfoCard for when art and card are in a row, then ArtworkMagazineCard for when art and card are in a column?
    return (
      <>
        <ArtworkInfoCard {...artwork} />
        {/* <TimelineCard artwork={artwork} isLoggedIn={false} /> */}
        {/* <ArtworkMagazineCard artwork={artwork} isLoggedIn={false} /> */}
        {/* <ArtworkMagazineCard2 artwork={artwork} isLoggedIn={false} /> */}
        {/* <ClassicMuseumCard artwork={artwork} isLoggedIn={false} /> */}
        {/* <ContemporaryGridCard artwork={artwork} isLoggedIn={false} /> */}
      </>
    );
  };
  return (
    <>
      <div
        className="
      grid 
      grid-rows-[minmax(0,max-content),minmax(0,1fr)] 
      gap-10
      lg:grid-cols-[1fr,1fr]
      lg:gap-4
      
    "
      >
        <span className="m-4 max-h-[70vh] justify-center lg:justify-self-end flex justify-end">
          {artwork && (
            <MagnifierImage
              src={artwork.image.secure_url}
              width={artwork.image.pixelWidth}
              height={artwork.image.pixelHeight}
              alt={artwork.title || "Artwork"}
              magnifierSize={250}
              magnificationLevel={8}
            />
          )}
        </span>

        <div className=" h-auto max-h-[70vh] flex flex-row justify-center items-center">
          <Card />
        </div>
      </div>
      {/* <div className="p-6">
        <HorizontalDivider />
      </div> */}
      {/* <CollectionInfoLayout /> */}

      {/* <div className="flex flex-row max-w-full  h-[200px] justify-center px-4"></div> */}
    </>
  );
};

export { ArtworkView };
