import FrameInfo from "./FrameInfo";
import { CloudinaryColorPalette, HexColorPalette } from "./ColorPallette";
import WatchlistButton from "@/components/atoms/buttons/WatchlistButton";
import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";

interface ArtworkInfoCardProps extends IFrontendArtwork {
  watchlisted: boolean;
}

const ArtworkInfoCard = ({ watchlisted, ...artwork }: ArtworkInfoCardProps) => {
  // const generateTempFrameInfo = (displayedArtwork: IFrontendArtwork) => {
  //   const temporaryFrameInfo = Object.fromEntries([
  //     ["height", displayedArtwork.image.pixelHeight * 1.5],
  //     ["width", displayedArtwork.image.pixelWidth * 1.5],
  //     ["material", "Wood"],
  //     ["style", "Classical"],
  //   ]);

  //   return temporaryFrameInfo;
  // };

  return (
    // <div className="flex flex-row justify-end items-start p-10 w-full">
    <div className="bg-green-100 flex flex-col text-left space-y-4 w-full md:px-10 md:mx-auto lg:w-[500px]">
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
      <p className="py-4 font-archivo text-md font-light text-gray-700">
        This picture used to hang on the wall as a focal point in Granddad's
        living room. As a child I remember asking him what it depicted. "Can't
        you tell?", he'd respond wryly.
      </p>
      <div className="w-full flex flex-col gap-3 md:flex-row md:gap-5">
        <WatchlistButton
          isWatchlisted={watchlisted}
          artworkId={artwork._id}
          // label={!watchlisted ? "Add to watchlist" : "Remove from watchlist"}
        />
        {/* <WatchlistButton itemId={artwork._id} isWatchlisted={false} /> */}
        {/* <button
              className="p-2 border border-2 border-black bg-black w-2/3 rounded-full font-subheading text-white font-bold"
              onClick={() => {
                handleAddToWatchList();
              }}
            >
              Add to watchlist
            </button> */}

        <button className="p-2 border border-2 border-black bg-whitish w-full rounded-full font-subheading text-black font-bold">
          Add to favourites
        </button>
      </div>
    </div>
    // </div>
  );
};

export default ArtworkInfoCard;
