import { FavouritesButton } from "@/components/elements/buttons/FavouritesButton";

import { PublicArtwork } from "@/lib/transforms/artworkToPublic";
import { HexColorPalette } from "../disclosures/ColorPallette";
import { WatchlistButton } from "@/components/elements/buttons";
import { Logo } from "@/components/elements/icons";

export const ArtworkMagazineCard = ({
  artwork,
  isLoggedIn,
}: {
  artwork: PublicArtwork;
  isLoggedIn: boolean;
}) => {
  return (
    <div className="w-full max-w-2xl p-12 bg-white">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8">
          <h1 className="font-archivoBlack text-4xl leading-tight mb-6">
            {artwork.title}
          </h1>
          <p className="text-3xl text-gray-400 font-light">Joseph Laoutaris</p>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="border-l-4 border-black pl-4">
            <p className="text-sm uppercase tracking-wider">Period</p>
            <p className="text-xl">{artwork.decade}</p>
          </div>

          <div className="border-l-4 border-black pl-4">
            <p className="text-sm uppercase tracking-wider">Medium</p>
            <p className="text-xl">
              {artwork.medium} on {artwork.surface}
            </p>
          </div>
        </div>

        <div className="col-span-12">
          <hr className="my-8" />
        </div>

        <div className="col-span-6">
          <HexColorPalette
            colors={artwork.image.hexColors}
            label="Color Study"
          />
        </div>

        <div className="col-span-6 flex items-end justify-end space-x-4">
          <WatchlistButton
            isWatchlisted={artwork.isWatchlisted}
            artworkId={artwork._id}
            isLoggedIn={isLoggedIn}
          />
          <FavouritesButton
            isLoggedIn={isLoggedIn}
            isFavourited={artwork.isFavourited}
            artworkId={artwork._id}
          />
        </div>
      </div>
    </div>
  );
};

export const ArtworkMagazineCard2 = ({
  artwork,
  isLoggedIn,
}: {
  artwork: PublicArtwork;
  isLoggedIn: boolean;
}) => {
  return (
    <div className="w-full max-w-xl p-12 bg-white">
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-8 flex flex-col justify-center">
          <div className="flex flex-row items-center">
            <div className="h-[80px] w-[80px] bg-gradient-to-bl from-gray-400/10 to-gray-900/20 m-2 flex justify-center items-center">
              <div className="h-[25px] w-full m-auto flex justify-center items-center border-r-[3px] border-black pl-1">
                <h1 className="font-archivo text-4xl">JL</h1>
              </div>
            </div>
            <div className="text-left justify-start items-center my-auto pl-3">
              <h1 className="font-archivoBlack text-xl">Joseph </h1>
              <h1 className="font-archivoBlack text-xl">Laoutaris </h1>
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="border-l-4 border-black pl-4">
            <p className="text-sm uppercase tracking-wider">Period</p>
            <p className="text-xl">{artwork.decade}</p>
          </div>

          <div className="border-l-4 border-black pl-4">
            <p className="text-sm uppercase tracking-wider">Medium</p>
            <p className="text-xl">
              {artwork.medium} on {artwork.surface}
            </p>
          </div>
        </div>

        <div className="col-span-12">
          <hr className="my-8" />
        </div>

        <div className="col-span-6">
          <HexColorPalette
            colors={artwork.image.hexColors}
            label="Color Study"
          />
        </div>

        <div className="col-span-6 flex items-end justify-end space-x-4">
          <WatchlistButton
            isWatchlisted={artwork.isWatchlisted}
            artworkId={artwork._id}
            isLoggedIn={isLoggedIn}
          />
          <FavouritesButton
            isLoggedIn={isLoggedIn}
            isFavourited={artwork.isFavourited}
            artworkId={artwork._id}
          />
        </div>
      </div>
    </div>
  );
};
