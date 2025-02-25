import { authOptions } from "@/lib/config/authOptions";
import { getServerSession } from "next-auth";
import { PublicArtwork } from "@/lib/transforms/artworkToPublic";
import {
  CloudinaryColorPalette,
  HexColorPalette,
} from "@/components/modules/disclosures/ColorPallette";
import { FavouritesButton } from "@/components/elements/buttons";
import { WatchlistButton } from "@/components/elements/buttons";

export async function ArtworkInfoCard({ ...artwork }: PublicArtwork) {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  return (
    <div className=" flex flex-col text-left space-y-5 h-auto w-[80vw] md:w-[500px] md:px-24 md:py-20 md:bg-zinc-200/5 fade-in md:border-l-2 border-gray-200 md:shadow-sm">
      <h1 className="font-archivo text-3xl hidden md:block">
        Joseph Laoutaris
      </h1>
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
      <div className="w-full flex  gap-3 flex-row md:gap-5 lg:flex-row">
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
}
