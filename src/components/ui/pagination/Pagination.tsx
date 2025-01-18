import { delay } from "@/utils/debug";
import React from "react";
import PaginationItem, { PaginationArtworkLink } from "./PaginationItem";
import HorizontalDivider from "@/components/ui/atoms/HorizontalDivider";
import ArtistProfile from "@/components/ui/atoms/ArtistProfile";
import SubscribeForm from "../forms/SubscribeForm";

interface PaginationProps {
  getData: () => Promise<PaginationArtworkLink[]>;
}

const Pagination = async ({ getData }: PaginationProps) => {
  await delay(2000);

  const paginationData = await getData();

  return (
    <>
      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <h1 className="px-4 py-6 text-2xl font-bold">
        More from this collection
      </h1>
      <div className="flex items-center pl-4">
        {paginationData.map((artworkLink) => (
          <PaginationItem
            key={artworkLink.link_to}
            secure_url={artworkLink.secure_url}
            height={artworkLink.height}
            width={artworkLink.width}
            link_to={artworkLink.link_to}
          />
        ))}
      </div>
      ;
      {/* <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <div className="flex flex-col w-full p-4 md:flex-row lg:px-24">
        <div className="flex flex-col">
          <h1 className="px-4 py-6 text-2xl font-bold">
            About this collection
          </h1>

          <p className="px-4 text-primary py-8">
            There are {paginationData.length} pieces in this collection.
          </p>
        </div>

        <div className="px-4 py-8 md:hidden">
          <HorizontalDivider />
        </div>
        <div className="bg-slate-800/10 w-full flex flex-col w-full">
          <ArtistProfile />
        </div>
      </div>

      <div className="px-4 py-4">
        <HorizontalDivider />
      </div>
      <div className="px-4 w-full md:w-1/2 mx-auto">
        <h1 className=" py-6 text-2xl font-bold">Subscribe for updates</h1>
        <SubscribeForm />
      </div>
      <div className="px-4 py-4">
        <HorizontalDivider />
      </div> */}
    </>
  );
};

export { Pagination };
