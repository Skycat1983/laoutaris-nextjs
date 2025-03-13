import {
  CloudinaryColorPalette,
  HexColorPalette,
} from "@/components/modules/disclosures/ColorPallette";
import {
  FavouritesButton,
  WatchlistButton,
} from "@/components/elements/buttons";
import { Bookmark, Heart } from "lucide-react";
import HorizontalDivider from "@/components/elements/misc/HorizontalDivider";
import { ArtworkFrontend } from "@/lib/data/types/artworkTypes";

// Classic Museum Card
export const ClassicMuseumCard = ({
  artwork,
  isLoggedIn,
}: {
  artwork: ArtworkFrontend;
  isLoggedIn: boolean;
}) => {
  return (
    <div className="w-5/8 max-w-2xl pb-12 px-12 bg-cream-50 border border-gray-200">
      <div className="space-y-8">
        {/* <div className="text-left border-b pb-6">
          <h1 className="font-serif text-3xl mb-2">Joseph Laoutaris</h1>
          <h2 className="font-serif text-xl italic text-gray-700">
            {artwork.title}
          </h2>
        </div> */}

        <div className="">
          <div className="py-8 container mx-auto">
            <HorizontalDivider />
          </div>
          <h1 className="text-4xl text-center font-thin fontface-crimson">
            Artwork info
          </h1>
          <div className="py-8 container mx-auto">
            <HorizontalDivider />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>Period: {artwork.decade}</div>
          <div>Medium: {artwork.medium}</div>
          <div>Surface: {artwork.surface}</div>
          <div>
            Dimensions: {artwork.image.pixelHeight} x {artwork.image.pixelWidth}
          </div>
        </div>

        <div className="py-6">
          <CloudinaryColorPalette
            colors={artwork.image.predominantColors.cloudinary}
            label="Color Analysis"
          />
        </div>

        <div className="flex justify-center space-x-6 pt-6 border-t">
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

// Contemporary Grid
export const ContemporaryGridCard = ({
  artwork,
  isLoggedIn,
}: {
  artwork: ArtworkFrontend;
  isLoggedIn: boolean;
}) => {
  return (
    <div className="w-1/2 max-w-4xl p-6 bg-whitish text-black rounded-xl p-16 shadow">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-8">
        <div className="col-span-2 md:col-span-3">
          <h1 className="font-archivo text-3xl">{artwork.title}</h1>
          <p className="text-zinc-400 mt-2">Joseph Laoutaris</p>
        </div>

        <div className="border-l-4 border-gray-200 pl-4">
          <h3 className="text-sm uppercase tracking-wider text-zinc-400">
            Period
          </h3>
          <p className="text-xl text-gray-800 mt-1">{artwork.decade}</p>
        </div>

        <div className="border-l-4 border-gray-200 pl-4">
          <h3 className="text-sm uppercase tracking-wider text-zinc-400">
            Medium
          </h3>
          <p className="text-xl text-gray-800 mt-1">
            {artwork.medium} on {artwork.surface}
          </p>
        </div>

        <div className="border-l-4 border-gray-200 pl-4">
          <h3 className="text-sm uppercase tracking-wider text-zinc-400">
            Size
          </h3>
          <p className="text-xl text-gray-800 mt-1">
            {artwork.image.pixelHeight} x {artwork.image.pixelWidth}
          </p>
        </div>

        <div className="col-span-2 md:col-span-3">
          <HexColorPalette
            colors={artwork.image.hexColors}
            label="Color Analysis"
          />
        </div>

        <div className="col-span-2 md:col-span-3 flex space-x-4">
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

export const ContemporaryGridCardDark = ({
  artwork,
  isLoggedIn,
}: {
  artwork: ArtworkFrontend;
  isLoggedIn: boolean;
}) => {
  return (
    <div className="w-1/2 max-w-4xl p-6 bg-zinc-900 text-white rounded-xl">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="col-span-2 md:col-span-3">
          <h1 className="font-archivoBlack text-3xl">{artwork.title}</h1>
          <p className="text-zinc-400 mt-2">Joseph Laoutaris</p>
        </div>

        <div className="bg-zinc-800 p-4 rounded-lg">
          <h3 className="text-sm text-zinc-400 mb-2">Period</h3>
          <p className="text-xl">{artwork.decade}</p>
        </div>

        <div className="bg-zinc-800 p-4 rounded-lg">
          <h3 className="text-sm text-zinc-400 mb-2">Medium</h3>
          <p className="text-xl">
            {artwork.medium} on {artwork.surface}
          </p>
        </div>

        <div className="bg-zinc-800 p-4 rounded-lg">
          <h3 className="text-sm text-zinc-400 mb-2">Size</h3>
          <p className="text-xl">
            {artwork.image.pixelHeight} x {artwork.image.pixelWidth}
          </p>
        </div>

        <div className="col-span-2 md:col-span-3">
          <HexColorPalette
            colors={artwork.image.hexColors}
            label="Color Analysis"
          />
        </div>

        <div className="col-span-2 md:col-span-3 flex space-x-4">
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

// Timeline Style
export const TimelineCard = ({
  artwork,
  isLoggedIn,
}: {
  artwork: ArtworkFrontend;
  isLoggedIn: boolean;
}) => {
  const pl = "pl-8";
  return (
    <div className="w-1/2 max-w-2xl p-8 bg-whitish">
      <div className="relative pl-8 border-l-2 border-gray-200 space-y-12">
        <div className="relative">
          <div className="absolute -left-10 w-4 h-4 bg-gray-200 rounded-full" />
          <h1 className={`font-archivo text-3xl ${pl}`}>Joseph Laoutaris</h1>
          <h2 className={`text-xl text-gray-600 mt-2 ${pl}`}>
            {artwork.title}
          </h2>
        </div>

        <div className="relative">
          <div className="absolute -left-10 w-4 h-4 bg-gray-200 rounded-full" />
          <h3 className={`text-lg font-semibold ${pl}`}>Details</h3>
          <div className={`mt-4 space-y-2 text-gray-600 ${pl}`}>
            <p>Period: {artwork.decade}</p>
            <p>
              Medium: {artwork.medium} on {artwork.surface}
            </p>
            <p>
              Size: {artwork.image.pixelHeight} x {artwork.image.pixelWidth}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-10 w-4 h-4 bg-gray-200 rounded-full" />
          <h3 className={`text-lg font-semibold ${pl}`}>Color Analysis</h3>
          <div className={`mt-4 ${pl}`}>
            <CloudinaryColorPalette
              colors={artwork.image.predominantColors.cloudinary}
              label="Predominant Colors"
            />
          </div>
        </div>

        {/* <div className="relative w-1/2">
          <div className="absolute -left-10 w-4 h-4 bg-gray-200 rounded-full" />
          <div className={`flex space-x-4 ${pl}`}>
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
        </div> */}
        <div className="col-span-6 flex items-end justify-start space-x-6 pl-8">
          <div className="flex flex-col items-center gap-1">
            <Bookmark
              className={`w-6 h-6 transition-colors duration-300 cursor-pointer
                ${
                  artwork.isWatchlisted
                    ? "fill-black stroke-black"
                    : "stroke-gray-400 hover:stroke-black"
                }`}
            />
            <span className="text-xs text-gray-500">
              {artwork.watchlistCount}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Heart
              className={`w-6 h-6 transition-colors duration-300 cursor-pointer
                ${
                  artwork.isFavourited
                    ? "fill-black stroke-black"
                    : "stroke-gray-400 hover:stroke-black"
                }`}
            />
            <span className="text-xs text-gray-500">
              {artwork.favouriteCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Magazine Style
export const MagazineCard = ({
  artwork,
  isLoggedIn,
}: {
  artwork: ArtworkFrontend;
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
