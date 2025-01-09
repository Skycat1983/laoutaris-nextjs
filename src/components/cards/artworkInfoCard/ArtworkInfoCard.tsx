import { CloudinaryColorPalette, HexColorPalette } from "./ColorPallette";
import WatchlistButton from "@/components/atoms/buttons/WatchlistButton";
import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import FavouritesButton from "@/components/atoms/buttons/FavouritesButton";
import { authOptions } from "@/lib/config/authOptions";
import { getServerSession } from "next-auth";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "@/components/atoms/ModalMessage";

const ArtworkInfoCard = async ({ ...artwork }: IFrontendArtwork) => {
  const session = await getServerSession(authOptions);
  // console.log("session in ArtworkInfoCard", session);
  const isLoggedIn = !!session?.user;
  const isWatchlisted = !!artwork.watcherlist.includes(session?.user?.id);
  const isFavourited = !!artwork.favourited.includes(session?.user?.id);

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
          isWatchlisted={isWatchlisted}
          artworkId={artwork._id}
          isLoggedIn={isLoggedIn}
        />
        <FavouritesButton
          isLoggedIn={isLoggedIn}
          isFavourited={isFavourited}
          artworkId={artwork._id}
        />
      </div>
    </div>
  );
};

export default ArtworkInfoCard;
