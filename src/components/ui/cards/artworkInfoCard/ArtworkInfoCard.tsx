import { CloudinaryColorPalette, HexColorPalette } from "./ColorPallette";
import WatchlistButton from "@/components/ui/atoms/buttons/WatchlistButton";
import FavouritesButton from "@/components/ui/atoms/buttons/FavouritesButton";
import { authOptions } from "@/lib/config/authOptions";
import { getServerSession } from "next-auth";
import { SanitizedArtwork } from "@/lib/server/artwork/resolvers/artworkToView";

const ArtworkInfoCard = async ({ ...artwork }: SanitizedArtwork) => {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  return (
    <div className="  flex flex-col text-left space-y-4 h-auto w-[300px] md:w-[500px] md:p-24 md:bg-zinc-200/5 md:shadow fade-in">
      <h1 className="font-archivoBlack text-2xl">Joseph Laoutaris</h1>
      <h2 className="font-archivo text-lg font-normal text-gray-500 italic">
        {artwork.title}
      </h2>
      <h2 className="font-archivo text-lg font-normal text-gray-500">
        {artwork.decade}
      </h2>
      <hr />
      <p className="font-archivo text-md font-light text-gray-500">
        {artwork.medium.charAt(0).toUpperCase() + artwork.medium.slice(1)} on{" "}
        {artwork.surface}
      </p>
      <p className="font-archivo text-md font-light text-gray-500">
        {artwork.image.pixelHeight} x {artwork.image.pixelWidth}
      </p>
      <hr />
      <HexColorPalette
        colors={artwork.image.hexColors}
        label="Colour palette"
      />
      <CloudinaryColorPalette
        colors={artwork.image.predominantColors.cloudinary}
        label="Predominant colours"
      />
      <hr />
      <div className="w-full flex flex-col gap-3 md:flex-row md:gap-5 lg:flex-row">
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
  );
};

export default ArtworkInfoCard;
