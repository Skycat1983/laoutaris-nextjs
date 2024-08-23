"use server";

import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/shadcn/tabs";
import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import {
  CloudinaryColorPalette,
  HexColorPalette,
} from "@/components/cards/artworkInfoCard/ColorPallette";
import WatchlistButton from "@/components/atoms/buttons/WatchlistButton";
import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import EnquiryForm from "../forms/EnquiryForm";
import FavouritesButton from "@/components/atoms/buttons/FavouritesButton";

const ArtInfoTabs = ({ ...artwork }: IFrontendArtwork) => {
  const tabTriggerClassName = "py-4 px-12 m-0 text-lg w-full";
  const isWatchlisted = !!artwork.watcherlist.length;
  const isFavourited = !!artwork.favourited.length;
  console.log("artwork :>> ", artwork);
  console.log("isFavourited :>> ", isFavourited);
  return (
    <>
      <Tabs defaultValue="about" className="w-full p-0">
        <TabsList className="w-full">
          <TabsTrigger value="about" className={tabTriggerClassName}>
            About
          </TabsTrigger>
          <TabsTrigger value="enquire" className={tabTriggerClassName}>
            Enquire
          </TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <div className="bg-greyish flex flex-col p-8 text-left space-y-4 w-full md:px-10 md:mx-auto lg:w-[500px]">
            <h2 className="font-archivo text-lg font-bold text-gray-500 italic">
              {artwork.title}
            </h2>
            <h2 className="font-archivo text-lg font-normal text-gray-500">
              {artwork.decade}
            </h2>
            <hr />
            <p className="font-archivo text-md font-light text-gray-500">
              {artwork.medium.charAt(0).toUpperCase() + artwork.medium.slice(1)}{" "}
              on {artwork.surface}
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
            {/* <hr /> */}
          </div>
        </TabsContent>
        <TabsContent value="enquire">
          <EnquiryForm />
        </TabsContent>
      </Tabs>
      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <div className="w-full flex flex-col gap-3 sm:flex-row md:gap-5">
        <WatchlistButton
          isWatchlisted={isWatchlisted}
          artworkId={artwork._id}
        />
        <FavouritesButton isFavourited={isFavourited} artworkId={artwork._id} />

        {/* <button className="p-2 border border-2 border-black bg-whitish w-full rounded-full font-subheading text-black font-bold">
          Add to favourites
        </button> */}
      </div>
    </>
  );
};

export default ArtInfoTabs;
