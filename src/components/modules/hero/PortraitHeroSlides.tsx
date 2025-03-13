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

// Slide 1: Right Portrait with Left Content
export const RightPortraitSlide = ({ data }: { data: SlideData }) => {
  return (
    <div className="relative h-[850px] w-full overflow-hidden bg-slate">
      <div className="absolute right-0 h-full w-[55%] overflow-hidden">
        <div className="relative h-full w-full">
          <Image
            src={data.imageUrl}
            alt={data.title}
            fill
            quality={100}
            priority={true}
            className="object-cover object-center"
            sizes="45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate via-transparent to-transparent" />
        </div>
      </div>
      <div className="relative h-full max-w-[40%] px-16 flex flex-col justify-center items-end">
        <h1 className="text-7xl font-cormorant text-white mb-6">
          {data.title}
        </h1>
        <p className="text-2xl font-archivo text-white/80 mb-4 max-w-2xl">
          {data.subtitle}
        </p>
        <p className="text-lg font-archivo text-white/60 mb-8 max-w-xl">
          {data.summary}
        </p>
        <Link
          href={`/${data.section}/${data.slug}`}
          className="bg-white text-slate font-archivo font-bold px-10 py-4 w-fit hover:bg-white/90 transition-colors"
        >
          View Collection
        </Link>
      </div>
    </div>
  );
};

// Slide 2: Left Portrait with Overlapping Content
export const LeftPortraitOverlapSlide = ({ data }: { data: SlideData }) => {
  return (
    <div className="relative h-[850px] w-full overflow-hidden bg-black">
      <div className="absolute left-0 h-full w-[40%] overflow-hidden">
        <Image
          src={data.imageUrl}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover object-center"
          sizes="40vw"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black via-black/20 to-transparent" />
      </div>
      <div className="absolute right-0 h-full w-[70%] bg-gradient-to-l from-black via-black to-transparent">
        <div className="h-full flex flex-col justify-center items-end pr-16">
          <div className="max-w-2xl text-right">
            <h1 className="text-6xl font-cormorant text-white mb-6">
              {data.title}
            </h1>
            <p className="text-xl font-archivo text-white/80 mb-4">
              {data.subtitle}
            </p>
            <p className="text-lg font-archivo text-white/60 mb-8">
              {data.summary}
            </p>
            <Link
              href={`/${data.section}/${data.slug}`}
              className="inline-block bg-transparent border-2 border-white text-white font-archivo font-bold px-8 py-3 hover:bg-white hover:text-black transition-all"
            >
              Explore Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Slide 3: Right Portrait with Floating Card
export const RightPortraitCardSlide = ({ data }: { data: SlideData }) => {
  return (
    <div className="relative h-[850px] w-full overflow-hidden bg-[#1a1a1a]">
      <div className="absolute right-0 h-full w-1/2 overflow-hidden">
        <Image
          src={data.imageUrl}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover object-center"
          sizes="50vw"
        />
      </div>
      <div className="relative h-full flex items-center">
        <div className="ml-16 bg-white/10 backdrop-blur-md p-12 max-w-xl border border-white/10">
          <h1 className="text-5xl font-cormorant text-white mb-6">
            {data.title}
          </h1>
          <div className="w-24 h-[2px] bg-white/40 mb-6" />
          <p className="text-xl font-archivo text-white/80 mb-4">
            {data.subtitle}
          </p>
          <p className="text-lg font-archivo text-white/60 mb-8">
            {data.summary}
          </p>
          <Link
            href={`/${data.section}/${data.slug}`}
            className="block bg-white text-[#1a1a1a] font-archivo font-bold px-8 py-3 text-center hover:bg-white/90 transition-colors"
          >
            View Artwork
          </Link>
        </div>
      </div>
    </div>
  );
};

// Slide 4: Left Portrait with Vertical Text
export const LeftPortraitVerticalSlide = ({ data }: { data: SlideData }) => {
  return (
    <div className="relative h-[850px] w-full overflow-hidden bg-[#2c2c2c]">
      <div className="absolute left-0 h-full w-[55%] overflow-hidden">
        <Image
          src={data.imageUrl}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover object-center"
          sizes="45vw"
        />
        <RadialGradientOverlay />
      </div>
      <div className="absolute right-0 h-full w-[45%] flex">
        <div className="flex-1 flex flex-col justify-center pl-16 pr-24">
          <div className="space-y-8">
            <h1 className="text-6xl font-cormorant text-white leading-tight">
              {data.title}
            </h1>
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
              className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white font-archivo font-bold px-10 py-4 hover:bg-white hover:text-[#2c2c2c] transition-all"
            >
              Discover More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Slide 5: Right Portrait with Stacked Layout
export const RightPortraitStackedSlide = ({ data }: { data: SlideData }) => {
  return (
    <div className="relative h-[850px] w-full overflow-hidden bg-[#232323]">
      <div className="absolute right-0 h-full w-[42%] overflow-hidden">
        <div className="relative h-full w-full">
          <Image
            src={data.imageUrl}
            alt={data.title}
            fill
            quality={100}
            priority={true}
            className="object-cover object-center"
            sizes="42vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#232323] via-transparent to-transparent" />
        </div>
      </div>
      <div className="relative h-full flex flex-col justify-center pl-16 max-w-[58%]">
        <div className="border-l-4 border-white pl-8 py-2 mb-8">
          <p className="text-xl font-archivo text-white/60 uppercase tracking-wider">
            Featured Collection
          </p>
        </div>
        <h1 className="text-7xl font-cormorant text-white mb-8 leading-tight max-w-3xl">
          {data.title}
        </h1>
        <div className="space-y-6 max-w-xl mb-12">
          <p className="text-2xl font-archivo text-white/80">{data.subtitle}</p>
          <p className="text-lg font-archivo text-white/60">{data.summary}</p>
        </div>
        <Link
          href={`/${data.section}/${data.slug}`}
          className="bg-white/10 backdrop-blur-sm border-2 border-white text-white font-archivo font-bold px-12 py-4 w-fit hover:bg-white hover:text-[#232323] transition-all"
        >
          Explore Collection
        </Link>
      </div>
    </div>
  );
};
