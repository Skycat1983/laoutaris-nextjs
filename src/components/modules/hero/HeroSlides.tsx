import Image from "next/image";
import Link from "next/link";
import { DimmedOverlay, RadialGradientOverlay } from "./Overlays";

// Types
interface SlideData {
  _id: { $oid: string };
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  imageUrl: string;
  section: string;
  slug: string;
  artworks: Array<{ $oid: string }>;
  readOnly: boolean;
  createdAt: { $date: string };
  updatedAt: { $date: string };
  __v: number;
}

// Slide 1: Split Layout with Gradient Text
export const SplitLayoutSlide = ({ data }: { data: SlideData }) => {
  return (
    <div className="relative h-[850px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={data.imageUrl}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent">
        <div className="h-full flex flex-col justify-center px-16 max-w-2xl">
          <h1 className="text-6xl font-cormorant text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-4">
            {data.title}
          </h1>
          <p className="text-xl font-archivo text-white/80 mb-8">
            {data.subtitle}
          </p>
          <Link
            href={`/${data.section}/${data.slug}`}
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-archivo font-bold px-8 py-3 rounded-md w-fit hover:bg-white/20 transition-colors"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

// Slide 2: Center Focus with Radial Vignette
export const CenterFocusSlide = ({ data }: { data: SlideData }) => {
  return (
    <div className="relative h-[850px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={data.imageUrl}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover scale-110"
          sizes="100vw"
        />
      </div>
      <RadialGradientOverlay />
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="bg-black/30 backdrop-blur-sm p-12 rounded-lg max-w-3xl mx-4">
          <h1 className="text-5xl font-cormorant text-white mb-4">
            {data.title}
          </h1>
          <p className="text-xl font-archivo text-white/90 mb-8">
            {data.subtitle}
          </p>
          <p className="text-lg font-archivo text-white/80 mb-8">
            {data.summary}
          </p>
          <Link
            href={`/${data.section}/${data.slug}`}
            className="inline-block bg-white text-black font-archivo font-bold px-8 py-3 rounded-md hover:bg-white/90 transition-colors"
          >
            View Gallery
          </Link>
        </div>
      </div>
    </div>
  );
};

// Slide 3: Bottom Text Panel with Blur
export const BottomPanelSlide = ({ data }: { data: SlideData }) => {
  return (
    <div className="relative h-[850px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={data.imageUrl}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute bottom-1/3 inset-x-0 bg-black/40 backdrop-blur-md w-1/2">
        <div className="container mx-auto px-8 py-12 grid grid-cols-12 gap-8 w-2/3">
          <div className="col-span-8">
            <h1 className="text-6xl font-cormorant text-white mb-3">
              {data.title}
            </h1>
            <p className="text-xl font-archivo text-white/80">
              {data.subtitle}
            </p>
          </div>
          {/* <div className="col-span-4 flex items-center justify-end">
            <Link
              href={`/${data.section}/${data.slug}`}
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white font-archivo font-bold px-8 py-3 hover:bg-white hover:text-black transition-all w-full"
            >
              Discover More
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

// Slide 4: Left Panel with Border
export const LeftPanelSlide = ({ data }: { data: SlideData }) => {
  return (
    <div className="relative h-[850px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={data.imageUrl}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <DimmedOverlay />
      <div className="absolute inset-y-0 left-0 w-1/2 bg-black/40 backdrop-blur-sm border-r border-white/20">
        <div className="h-full flex flex-col justify-center px-16 ml-12">
          <div className="border-l-4 border-white pl-6">
            <h1 className="text-5xl font-cormorant text-white mb-4">
              {data.title}
            </h1>
            <p className="text-xl font-archivo text-white/80 mb-2">
              {data.subtitle}
            </p>
            <p className="text-lg font-archivo text-white/60 mb-2">
              {data.summary}
            </p>
          </div>
          <Link
            href={`/${data.section}/${data.slug}`}
            className="bg-white text-black font-archivo font-bold px-8 py-3 rounded-none w-fit hover:bg-white/90 transition-colors my-4 ml-6"
          >
            Enter Gallery
          </Link>
        </div>
      </div>
    </div>
  );
};

export const RightPanelSlide = ({ data }: { data: SlideData }) => {
  return (
    <div className="relative h-[850px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={data.imageUrl}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <DimmedOverlay />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-black/40 backdrop-blur-sm border-r border-white/20">
        <div className="h-full flex flex-col justify-center px-16 ml-12">
          <div className="border-l-4 border-white pl-6">
            <h1 className="text-5xl font-cormorant text-white mb-4">
              {data.title}
            </h1>
            <p className="text-xl font-archivo text-white/80 mb-2">
              {data.subtitle}
            </p>
            <p className="text-lg font-archivo text-white/60 mb-2">
              {data.summary}
            </p>
          </div>
          <Link
            href={`/${data.section}/${data.slug}`}
            className="bg-white text-black font-archivo font-bold px-8 py-3 rounded-none w-fit hover:bg-white/90 transition-colors my-4 ml-6"
          >
            Enter Gallery
          </Link>
        </div>
      </div>
    </div>
  );
};

// Slide 5: Minimal with Hover Effect
export const MinimalSlide = ({ data }: { data: SlideData }) => {
  return (
    <div className="relative h-[850px] w-full overflow-hidden group">
      <div className="absolute inset-0">
        <Image
          src={data.imageUrl}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40" />
      <div className="absolute inset-24 flex items-end justify-center">
        <div className="text-center transform transition-transform duration-500 group-hover:translate-y-0 translate-y-4">
          <h1 className="text-7xl font-cormorant text-white mb-4">
            {data.title}
          </h1>
          <p className="text-xl font-archivo text-white/90 mb-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {data.subtitle}
          </p>
          <Link
            href={`/${data.section}/${data.slug}`}
            className="inline-block bg-transparent border-2 border-white text-white font-archivo font-bold px-8 py-3 hover:bg-white hover:text-black transition-all"
          >
            View Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

// Slide 6: Grid Layout
export const GridLayoutSlide = ({ data }: { data: SlideData }) => {
  return (
    <div className="relative h-[850px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={data.imageUrl}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-black/50">
        <div className="h-full grid grid-cols-5 gap-8 p-16">
          <div className="flex flex-col justify-center col-start-4">
            <h1 className="text-7xl font-cormorant text-white mb-4">
              {data.title}
            </h1>
            <div className="w-32 h-1 bg-white mb-8" />
            <p className="text-xl font-archivo text-white/80 mb-8">
              {data.subtitle}
            </p>
            <Link
              href={`/${data.section}/${data.slug}`}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-archivo font-bold px-8 py-3 w-fit hover:bg-white hover:text-black transition-all"
            >
              Explore Works
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-2xl font-archivo text-white/90 italic">
              {data.summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
