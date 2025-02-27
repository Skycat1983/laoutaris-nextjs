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

export const CollectionMagazineCard3a = ({
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

export const CollectionMagazineCard3b = ({
  title,
  subtitle,
  artworkCount = 0,
  period = "1950s",
  medium = "Oil on Canvas",
}: CollectionCardProps) => {
  return (
    <div className="w-full max-w-2xl bg-gray-900">
      <div className="flex justify-between items-start p-8 border-b border-gray-700">
        <div>
          <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">
            Collection
          </p>
          <h2 className="text-2xl font-medium text-white">{title}</h2>
        </div>
        <div className="text-right">
          <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">
            Artist
          </p>
          <p className="text-lg text-white">Joseph Laoutaris</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 p-8">
        <div className="col-span-8">
          <p className="text-gray-300 mb-6">{subtitle}</p>
          <div className="flex space-x-12">
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">
                Period
              </p>
              <p className="text-lg text-white">{period}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">
                Medium
              </p>
              <p className="text-lg text-white">{medium}</p>
            </div>
          </div>
        </div>
        <div className="col-span-4 bg-gray-800 p-6 flex flex-col items-center justify-center">
          <p className="text-4xl font-light mb-2 text-white">{artworkCount}</p>
          <p className="text-sm uppercase tracking-wider text-gray-400">
            Artworks
          </p>
          <button className="mt-4 text-sm font-medium text-white border-b border-gray-600 hover:border-white transition-colors">
            Browse Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export const CollectionMagazineCard3c = ({
  title,
  subtitle,
  artworkCount = 0,
  period = "1950s",
  medium = "Oil on Canvas",
}: CollectionCardProps) => {
  return (
    <div className="w-full max-w-2xl bg-white">
      <div className="flex justify-between items-start bg-gray-900 p-8">
        <div className="flex-1">
          <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">
            Collection
          </p>
          <h2 className="text-3xl font-light text-white">{title}</h2>
        </div>
        <div className="ml-8 flex flex-col items-end">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-2">
            <span className="text-2xl font-light">{artworkCount}</span>
          </div>
          <p className="text-sm uppercase tracking-wider text-gray-400">
            Artworks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 p-8">
        <div className="col-span-12">
          <p className="text-gray-700 mb-8 text-lg">{subtitle}</p>
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
            <div className="ml-auto">
              <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">
                Artist
              </p>
              <p className="text-lg">Joseph Laoutaris</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CollectionMagazineCard3d = ({
  title,
  subtitle,
  artworkCount = 0,
  period = "1950s",
  medium = "Oil on Canvas",
}: CollectionCardProps) => {
  return (
    <div className="w-full max-w-2xl bg-white">
      <div className="grid grid-cols-12 bg-gray-900">
        <div className="col-span-8 p-8">
          <p className="text-sm uppercase tracking-wider text-gray-400 mb-2">
            Collection
          </p>
          <h2 className="text-3xl font-medium text-white mb-4">{title}</h2>
          <p className="text-gray-300">{subtitle}</p>
        </div>
        <div className="col-span-4 bg-black p-8 flex flex-col justify-center items-center">
          <p className="text-5xl font-light text-white mb-2">{artworkCount}</p>
          <p className="text-sm uppercase tracking-wider text-gray-400">
            Artworks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-8">
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
        <div>
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">
            Artist
          </p>
          <p className="text-lg">Joseph Laoutaris</p>
        </div>
      </div>
    </div>
  );
};

export const CollectionMagazineCard3e = ({
  title,
  subtitle,
  artworkCount = 0,
  period = "1950s",
  medium = "Oil on Canvas",
}: CollectionCardProps) => {
  return (
    <div className="w-full max-w-2xl bg-gradient-to-b from-gray-900 to-black">
      <div className="p-8 border-b border-gray-800">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">
              Collection
            </p>
            <h2 className="text-3xl font-light text-white">{title}</h2>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-6xl font-light text-white mb-1">
              {artworkCount}
            </p>
            <p className="text-sm uppercase tracking-wider text-gray-400">
              Artworks
            </p>
          </div>
        </div>
        <p className="text-gray-300 text-lg">{subtitle}</p>
      </div>

      <div className="grid grid-cols-3 gap-8 p-8">
        <div>
          <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">
            Period
          </p>
          <p className="text-lg text-white">{period}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">
            Medium
          </p>
          <p className="text-lg text-white">{medium}</p>
        </div>
        <div className="text-right">
          <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">
            Artist
          </p>
          <p className="text-lg text-white">Joseph Laoutaris</p>
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

export const CollectionMagazineCardA = ({
  title,
  subtitle,
  artworkCount = 0,
  period = "1950s",
  medium = "Oil on Canvas",
  curator = "Eleanor Winters",
}: CollectionCardProps) => {
  return (
    <div className="w-full max-w-2xl pt-12 bg-gray-900">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 px-12">
          <h1 className="font-archivoBlack text-4xl leading-tight mb-6 text-white">
            {title}
          </h1>
          <p className="text-3xl text-gray-400 font-light">Joseph Laoutaris</p>
        </div>

        <div className="col-span-4 space-y-6 px-12">
          <div className="border-l-4 border-white pl-4">
            <p className="text-sm uppercase tracking-wider text-gray-400">
              Period
            </p>
            <p className="text-xl text-white">{period}</p>
          </div>

          <div className="border-l-4 border-white pl-4 px-12">
            <p className="text-sm uppercase tracking-wider text-gray-400">
              Medium
            </p>
            <p className="text-xl text-white">{medium}</p>
          </div>
        </div>

        <div className="col-span-12 bg-white">
          <hr className="mb-8 border-gray-700 bg-white" />
        </div>
        <div className="w-full h-full col-span-12 grid grid-cols-12 bg-white px-12 pb-12">
          <div className="col-span-6">
            <div className="space-y-0">
              <p className="text-sm uppercase tracking-wider text-gray-400">
                Collection Summary:
              </p>
            </div>
          </div>

          <div className="col-span-6 flex items-start justify-start space-x-8">
            <div className="text-right">
              <p className="text-sm uppercase tracking-wider text-black">
                Artworks
              </p>
              <p className="text-2xl font-light text-black">{artworkCount}</p>
            </div>
            <div className="text-right">
              <p className="text-sm uppercase tracking-wider text-black">
                Curator
              </p>
              <p className="text-base font-light text-black">{curator}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CollectionMagazineCardB = ({
  title,
  subtitle,
  artworkCount = 0,
  period = "1950s",
  medium = "Oil on Canvas",
  curator = "Eleanor Winters",
}: CollectionCardProps) => {
  return (
    <div className="w-full max-w-2xl pt-12 px-12 pb-12 bg-black">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 mb-8">
          <h1 className="font-archivoBlack text-5xl leading-tight mb-4 text-white">
            {title}
          </h1>
          <div className="flex justify-between items-end">
            <p className="text-2xl text-gray-400 font-light">
              Joseph Laoutaris
            </p>
            <p className="text-6xl font-light text-white">{artworkCount}</p>
          </div>
        </div>

        <div className="col-span-12">
          <hr className="my-8 border-gray-800" />
        </div>

        <div className="col-span-4">
          <div className="border-l-4 border-gray-700 pl-4">
            <p className="text-sm uppercase tracking-wider text-gray-500">
              Period
            </p>
            <p className="text-xl text-white">{period}</p>
          </div>
        </div>

        <div className="col-span-4">
          <div className="border-l-4 border-gray-700 pl-4">
            <p className="text-sm uppercase tracking-wider text-gray-500">
              Medium
            </p>
            <p className="text-xl text-white">{medium}</p>
          </div>
        </div>

        <div className="col-span-4">
          <div className="border-l-4 border-gray-700 pl-4">
            <p className="text-sm uppercase tracking-wider text-gray-500">
              Curator
            </p>
            <p className="text-xl text-white">{curator}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CollectionMagazineCardC = ({
  title,
  subtitle,
  artworkCount = 0,
  period = "1950s",
  medium = "Oil on Canvas",
  curator = "Eleanor Winters",
}: CollectionCardProps) => {
  return (
    <div className="w-full max-w-2xl pt-12 px-12 pb-12 bg-gradient-to-br from-gray-900 to-black">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <p className="text-sm uppercase tracking-wider text-gray-400 mb-2">
            Collection
          </p>
          <h1 className="font-archivoBlack text-4xl leading-tight mb-6 text-white">
            {title}
          </h1>
        </div>

        <div className="col-span-4">
          <div className="w-24 h-24 ml-auto rounded-full bg-white flex flex-col items-center justify-center">
            <p className="text-3xl font-light">{artworkCount}</p>
            <p className="text-xs uppercase tracking-wider">Works</p>
          </div>
        </div>

        <div className="col-span-12">
          <hr className="my-8 border-gray-700" />
        </div>

        <div className="col-span-4">
          <p className="text-sm uppercase tracking-wider text-gray-400">
            Artist
          </p>
          <p className="text-xl text-white">Joseph Laoutaris</p>
        </div>

        <div className="col-span-4">
          <p className="text-sm uppercase tracking-wider text-gray-400">
            Period
          </p>
          <p className="text-xl text-white">{period}</p>
        </div>

        <div className="col-span-4">
          <p className="text-sm uppercase tracking-wider text-gray-400">
            Curator
          </p>
          <p className="text-xl text-white">{curator}</p>
        </div>
      </div>
    </div>
  );
};

export const CollectionMagazineCardD = ({
  title,
  subtitle,
  artworkCount = 0,
  period = "1950s",
  medium = "Oil on Canvas",
  curator = "Eleanor Winters",
}: CollectionCardProps) => {
  return (
    <div className="w-full max-w-2xl bg-white">
      <div className="bg-black px-12 pt-12 pb-8">
        <h1 className="font-archivoBlack text-4xl leading-tight mb-6 text-white">
          {title}
        </h1>
        <p className="text-2xl text-gray-400 font-light">Joseph Laoutaris</p>
      </div>

      <div className="px-12 py-8 grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="border-l-4 border-black pl-4">
            <p className="text-sm uppercase tracking-wider text-gray-500">
              Period
            </p>
            <p className="text-xl">{period}</p>
          </div>
        </div>

        <div className="col-span-4">
          <div className="border-l-4 border-black pl-4">
            <p className="text-sm uppercase tracking-wider text-gray-500">
              Artworks
            </p>
            <p className="text-xl">{artworkCount}</p>
          </div>
        </div>

        <div className="col-span-4">
          <div className="border-l-4 border-black pl-4">
            <p className="text-sm uppercase tracking-wider text-gray-500">
              Curator
            </p>
            <p className="text-xl">{curator}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CollectionMagazineCardE = ({
  title,
  subtitle,
  artworkCount = 0,
  period = "1950s",
  medium = "Oil on Canvas",
  curator = "Eleanor Winters",
}: CollectionCardProps) => {
  return (
    <div className="w-full max-w-2xl pt-12 px-12 pb-12 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7">
          <h1 className="font-archivoBlack text-4xl leading-tight mb-6 text-white">
            {title}
          </h1>
          <p className="text-2xl text-gray-400 font-light mb-8">
            Joseph Laoutaris
          </p>

          <div className="space-y-6">
            <div className="border-l-4 border-gray-700 pl-4">
              <p className="text-sm uppercase tracking-wider text-gray-400">
                Period
              </p>
              <p className="text-xl text-white">{period}</p>
            </div>
            <div className="border-l-4 border-gray-700 pl-4">
              <p className="text-sm uppercase tracking-wider text-gray-400">
                Medium
              </p>
              <p className="text-xl text-white">{medium}</p>
            </div>
          </div>
        </div>

        <div className="col-span-5">
          <div className="flex flex-col items-end">
            <div className="text-right mb-8">
              <p className="text-7xl font-light text-white mb-2">
                {artworkCount}
              </p>
              <p className="text-sm uppercase tracking-wider text-gray-400">
                Artworks in Collection
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">
                Curator
              </p>
              <p className="text-xl text-white">{curator}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
