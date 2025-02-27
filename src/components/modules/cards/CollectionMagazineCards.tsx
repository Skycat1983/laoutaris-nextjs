"use client";

import React from "react";
import Image from "next/image";
import {
  NewLogoDark,
  NewLogoLight,
} from "@/components/elements/icons/NewLogos";

interface CollectionCardProps {
  title: string;
  subtitle?: string;
  artworkCount?: number;
  period?: string;
  medium?: string;
  imageUrl?: string;
  curator?: string;
}

// Do a variation of this one but with some parts inverted, white text on black background
export const CollectionMagazineCard = ({
  title,
  subtitle,
  artworkCount = 0,
  period = "1950s",
  medium = "Oil on Canvas",
  curator = "Eleanor Winters",
}: CollectionCardProps) => {
  return (
    <div className="w-full max-w-2xl pt-12 px-12 pb-12 bg-white">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <h1 className="font-archivoBlack text-4xl leading-tight mb-6">
            {title}
          </h1>
          <p className="text-3xl text-gray-400 font-light">Joseph Laoutaris</p>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="border-l-4 border-black pl-4">
            <p className="text-sm uppercase tracking-wider">Period</p>
            <p className="text-xl">{period}</p>
          </div>

          <div className="border-l-4 border-black pl-4">
            <p className="text-sm uppercase tracking-wider">Medium</p>
            <p className="text-xl">{medium}</p>
          </div>
        </div>

        <div className="col-span-12">
          <hr className="my-8" />
        </div>

        <div className="col-span-6">
          <div className="space-y-0">
            <p className="text-sm uppercase tracking-wider">
              Collection Summary:
            </p>
            {/* <p className="text-base text-gray-700">{subtitle}</p> */}
          </div>
        </div>

        <div className="col-span-6 flex items-start justify-start space-x-8">
          <div className="text-right">
            <p className="text-sm uppercase tracking-wider">Artworks</p>
            <p className="text-2xl font-light">{artworkCount}</p>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase tracking-wider">Curator</p>
            <p className="text-base font-light">{curator}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CollectionMagazineCard2 = ({
  title,
  subtitle,
  artworkCount = 0,
  period = "1950s",
  medium = "Oil on Canvas",
}: CollectionCardProps) => {
  return (
    <div className="w-full max-w-xl p-8 bg-white">
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-8 flex flex-col justify-start">
          <div className="flex flex-row items-center">
            {/* <div className="h-[80px] w-[80px] bg-gradient-to-bl from-gray-400/10 to-gray-900/20 m-2 flex justify-center items-center ">
              <div className="h-[25px] w-full m-auto flex justify-center items-center border-r-[3px] border-black pl-1">
                <h1 className="font-archivo text-4xl">JL</h1>
              </div>
            </div>
            <div className="text-left justify-start items-center my-auto pl-3">
              <h1 className="font-archivoBlack text-xl">Joseph </h1>
              <h1 className="font-archivoBlack text-xl">Laoutaris </h1>
            </div> */}
            <NewLogoDark />
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="border-l-4 border-black pl-4">
            <p className="text-sm uppercase tracking-wider">Period</p>
            <p className="text-xl">{period}</p>
          </div>

          <div className="border-l-4 border-black pl-4">
            <p className="text-sm uppercase tracking-wider">Medium</p>
            <p className="text-xl">{medium}</p>
          </div>
        </div>

        <div className="col-span-12">
          <hr className="my-8" />
        </div>

        <div className="col-span-6">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wider">Collection</p>
            <p className="text-xl font-medium">{title}</p>
            <p className="text-sm text-gray-600 line-clamp-2">{subtitle}</p>
          </div>
        </div>

        <div className="col-span-6 flex items-end justify-end space-x-6">
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xl font-light">{artworkCount}</span>
            </div>
            <span className="text-xs text-gray-500">Artworks</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xl font-light">4</span>
            </div>
            <span className="text-xs text-gray-500">Exhibitions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Additional variations inspired by the magazine style

export const CollectionMagazineCard3 = ({
  title,
  subtitle,
  artworkCount = 0,
  period = "1950s",
  medium = "Oil on Canvas",
}: CollectionCardProps) => {
  return (
    <div className="w-full max-w-2xl p-8 bg-white border-t-4 border-black">
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">
            Collection
          </p>
          <h2 className="text-2xl font-medium">{title}</h2>
        </div>
        <div className="text-right">
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">
            Artist
          </p>
          <p className="text-lg">Joseph Laoutaris</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8">
          <p className="text-gray-700 mb-6">{subtitle}</p>

          <div className="flex space-x-12">
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">
                Period
              </p>
              <p className="text-lg">{period}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">
                Medium
              </p>
              <p className="text-lg">{medium}</p>
            </div>
          </div>
        </div>

        <div className="col-span-4 bg-gray-50 p-6 flex flex-col items-center justify-center">
          <p className="text-4xl font-light mb-2">{artworkCount}</p>
          <p className="text-sm uppercase tracking-wider text-gray-500">
            Artworks
          </p>
          <button className="mt-4 text-sm font-medium border-b border-gray-400 hover:border-black transition-colors">
            Browse Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export const CollectionMagazineCard3b = ({
  title,
  subtitle,
  artworkCount = 0,
  period = "1950s",
  medium = "Oil on Canvas",
}: CollectionCardProps) => {
  return (
    <div className="w-full max-w-2xl bg-white border-t-4 border-black">
      <div className="flex justify-between items-start bg-gray-900 p-8">
        <div>
          <p className="text-sm uppercase tracking-wider text-gray-300 mb-1">
            Collection
          </p>
          <h2 className="text-2xl font-medium text-white">{title}</h2>
        </div>
        <div className="text-right">
          <p className="text-sm uppercase tracking-wider text-gray-300 mb-1">
            Artist
          </p>
          <p className="text-lg text-white">Joseph Laoutaris</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 p-8">
        <div className="col-span-8">
          <p className="text-gray-700 mb-6">{subtitle}</p>

          <div className="flex space-x-12">
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">
                Period
              </p>
              <p className="text-lg">{period}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">
                Medium
              </p>
              <p className="text-lg">{medium}</p>
            </div>
          </div>
        </div>

        <div className="col-span-4 bg-gray-50 p-6 flex flex-col items-center justify-center">
          <p className="text-4xl font-light mb-2">{artworkCount}</p>
          <p className="text-sm uppercase tracking-wider text-gray-500">
            Artworks
          </p>
          <button className="mt-4 text-sm font-medium border-b border-gray-400 hover:border-black transition-colors">
            Browse Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export const CollectionMagazineCard4 = ({
  title,
  subtitle,
  artworkCount = 0,
  period = "1950s",
}: CollectionCardProps) => {
  return (
    <div className="w-full bg-white h-full">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-3 bg-gray-900 text-white p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider mb-1 opacity-70">
              Collection
            </p>
            <h2 className="text-xl font-medium mb-4">{title}</h2>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider mb-1 opacity-70">
              Period
            </p>
            <p className="text-lg">{period}</p>
          </div>
        </div>

        <div className="col-span-9 p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="max-w-md">
              <p className="text-gray-700 mb-4">{subtitle}</p>
              <p className="text-sm text-gray-500">
                Curated by Eleanor Winters
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-center">
                <p className="text-3xl font-light">{artworkCount}</p>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Artworks
                </p>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Joseph Laoutaris (1920-2022)</p>
            <button className="text-sm font-medium hover:underline">
              View Collection →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
