import { Search } from "lucide-react";
import { ArtworkInfoCard } from "../modules/cards/ArtworkInfoCard";
import { TimelineCard } from "../modules/cards/ArtworkInfoCardVariations";

import { MagnifierImage } from "../modules/MagnifierImage";
import { ArtworkFrontend } from "@/lib/data/types/artworkTypes";

const ArtworkView = (artwork: ArtworkFrontend) => {
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
        <span className="m-4 justify-center lg:justify-self-end flex flex-col justify-end  max-w-2xl">
          <span className="m-4 max-h-[70vh] justify-center lg:justify-self-end flex justify-end  max-w-2xl">
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
          <div className="w-full flex justify-center items-center">
            <h1 className="text-neutral-400 px-2">Hover for magnified view:</h1>
            <Search className="text-neutral-400" />
          </div>
        </span>

        <div className=" h-auto max-h-[70vh] flex flex-row justify-center items-center">
          <Card />
        </div>
      </div>
      {/* <div className="flex flex-row justify-center items-center">
        <h1>hello</h1>
      </div> */}
    </>
  );
};

export { ArtworkView };
