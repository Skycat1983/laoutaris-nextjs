import { authOptions } from "@/lib/config/authOptions";
import { getServerSession } from "next-auth";
import { HexColorPalette } from "@/components/modules/disclosures/ColorPallette";
import { FavouritesButton } from "@/components/elements/buttons";
import { WatchlistButton } from "@/components/elements/buttons";
import HorizontalDivider from "@/components/elements/misc/HorizontalDivider";
import { ArtworkFrontend } from "@/lib/data/types/artworkTypes";

export async function ArtworkInfoCard({ ...artwork }: ArtworkFrontend) {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  return (
    <>
      <div className=" flex flex-col text-left space-y-5 h-auto w-[80vw] md:w-[500px] md:px-24 pb-16  fade-in md:border-l-2 border-gray-200 ">
        <div className="">
          <div className="py-8 container mx-auto">
            <HorizontalDivider />
          </div>
          <h1 className="text-4xl text-left font-thin fontface-crimson">
            Artwork info
          </h1>
          <div className="pt-8 container mx-auto">
            <HorizontalDivider />
          </div>
        </div>
        {/* <h1 className="font-archivo text-3xl hidden md:block">Artwork info</h1> */}
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
    </>
  );
}
