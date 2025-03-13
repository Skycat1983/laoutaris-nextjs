import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DimmedOverlay, RadialGradientOverlay } from "./Overlays";

// Types
interface SlideData {
  _id: { $oid: string };
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  imageUrls: string[]; // Changed to array
  section: string;
  slug: string;
  artworks: Array<{ $oid: string }>;
  readOnly: boolean;
  createdAt: { $date: string };
  updatedAt: { $date: string };
  __v: number;
}

// Utility hook for image cycling
const useImageCycle = (images: string[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return { currentImage: images[currentIndex], nextImage };
};

// Slide 1: Clean Split with Right Portrait
export const RightPortraitCleanSlide = ({ data }: { data: SlideData }) => {
  const { currentImage, nextImage } = useImageCycle(data.imageUrls);

  return (
    <div className="relative h-[850px] w-full overflow-hidden bg-[#2c2c2c]">
      <div
        className="absolute right-0 h-full w-[55%] overflow-hidden cursor-pointer"
        onClick={nextImage}
      >
        <Image
          src={currentImage}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover object-center"
          sizes="55vw"
        />
      </div>
      <div className="absolute left-0 h-full w-[45%] flex">
        <div className="flex-1 flex flex-col justify-center px-16">
          <h1 className="text-6xl font-cormorant text-white mb-8">
            {data.title}
          </h1>
          <p className="text-2xl font-archivo text-white/80 mb-4">
            {data.subtitle}
          </p>
          <p className="text-lg font-archivo text-white/60 mb-8">
            {data.summary}
          </p>
          <Link
            href={`/${data.section}/${data.slug}`}
            className="bg-white text-[#2c2c2c] font-archivo font-bold px-10 py-4 w-fit hover:bg-white/90 transition-colors"
          >
            View Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

// Slide 2: Left Portrait with Centered Content
export const LeftPortraitCenteredSlide = ({ data }: { data: SlideData }) => {
  const { currentImage, nextImage } = useImageCycle(data.imageUrls);

  return (
    <div className="relative h-[850px] w-full overflow-hidden bg-[#1a1a1a]">
      <div
        className="absolute left-0 h-full w-[55%] overflow-hidden cursor-pointer"
        onClick={nextImage}
      >
        <Image
          src={currentImage}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover object-center"
          sizes="55vw"
        />
      </div>
      <div className="absolute right-0 h-full w-[45%] flex">
        <div className="flex-1 flex flex-col justify-center items-center text-center px-12">
          <h1 className="text-7xl font-cormorant text-white mb-6">
            {data.title}
          </h1>
          <div className="w-24 h-[2px] bg-white mb-8" />
          <p className="text-2xl font-archivo text-white/80 mb-4">
            {data.subtitle}
          </p>
          <p className="text-lg font-archivo text-white/60 mb-8">
            {data.summary}
          </p>
          <Link
            href={`/${data.section}/${data.slug}`}
            className="bg-transparent border-2 border-white text-white font-archivo font-bold px-12 py-4 hover:bg-white hover:text-[#1a1a1a] transition-all"
          >
            Explore Works
          </Link>
        </div>
      </div>
    </div>
  );
};

// Slide 3: Right Portrait with Large Typography
export const RightPortraitLargeTypeSlide = ({ data }: { data: SlideData }) => {
  const { currentImage, nextImage } = useImageCycle(data.imageUrls);

  return (
    <div className="relative h-[850px] w-full overflow-hidden bg-[#232323]">
      <div
        className="absolute right-0 h-full w-[55%] overflow-hidden cursor-pointer"
        onClick={nextImage}
      >
        <Image
          src={currentImage}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover object-center"
          sizes="55vw"
        />
      </div>
      <div className="absolute left-0 h-full w-[45%] flex">
        <div className="flex-1 flex flex-col justify-center px-16">
          <h1 className="text-8xl font-cormorant text-white mb-8 leading-tight">
            {data.title}
          </h1>
          <p className="text-3xl font-archivo text-white/80 mb-6">
            {data.subtitle}
          </p>
          <p className="text-xl font-archivo text-white/60 mb-10">
            {data.summary}
          </p>
          <Link
            href={`/${data.section}/${data.slug}`}
            className="bg-white/10 backdrop-blur-sm border border-white text-white font-archivo font-bold px-12 py-4 w-fit hover:bg-white hover:text-[#232323] transition-all"
          >
            View Gallery
          </Link>
        </div>
      </div>
    </div>
  );
};

// Slide 4: Left Portrait with Vertical Rhythm
export const LeftPortraitVerticalRhythmSlide = ({
  data,
}: {
  data: SlideData;
}) => {
  const { currentImage, nextImage } = useImageCycle(data.imageUrls);

  return (
    <div className="relative h-[850px] w-full overflow-hidden bg-[#1c1c1c]">
      <div
        className="absolute left-0 h-full w-[55%] overflow-hidden cursor-pointer"
        onClick={nextImage}
      >
        <Image
          src={currentImage}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover object-center"
          sizes="55vw"
        />
      </div>
      <div className="absolute right-0 h-full w-[45%] flex">
        <div className="flex-1 flex flex-col justify-center px-16">
          <div className="border-l-4 border-white pl-8">
            <p className="text-xl font-archivo text-white/60 uppercase tracking-wider mb-4">
              Featured Work
            </p>
            <h1 className="text-6xl font-cormorant text-white mb-6">
              {data.title}
            </h1>
            <p className="text-2xl font-archivo text-white/80 mb-4">
              {data.subtitle}
            </p>
            <p className="text-lg font-archivo text-white/60 mb-8">
              {data.summary}
            </p>
            <Link
              href={`/${data.section}/${data.slug}`}
              className="inline-block bg-white text-[#1c1c1c] font-archivo font-bold px-10 py-4 hover:bg-white/90 transition-colors"
            >
              Discover More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Slide 5: Right Portrait with Minimal Design
export const RightPortraitMinimalSlide = ({ data }: { data: SlideData }) => {
  const { currentImage, nextImage } = useImageCycle(data.imageUrls);

  return (
    <div className="relative h-[850px] w-full overflow-hidden bg-[#262626]">
      <div
        className="absolute right-0 h-full w-[55%] overflow-hidden cursor-pointer"
        onClick={nextImage}
      >
        <Image
          src={currentImage}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover object-center"
          sizes="55vw"
        />
      </div>
      <div className="absolute left-0 h-full w-[45%] flex">
        <div className="flex-1 flex flex-col justify-center px-16">
          <div className="space-y-8">
            <h1 className="text-7xl font-cormorant text-white">{data.title}</h1>
            <div className="space-y-4">
              <p className="text-2xl font-archivo text-white/80">
                {data.subtitle}
              </p>
              <p className="text-lg font-archivo text-white/60">
                {data.summary}
              </p>
            </div>
            <Link
              href={`/${data.section}/${data.slug}`}
              className="inline-block bg-transparent border border-white/20 text-white font-archivo font-bold px-12 py-4 hover:bg-white hover:text-[#262626] transition-all"
            >
              View Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
