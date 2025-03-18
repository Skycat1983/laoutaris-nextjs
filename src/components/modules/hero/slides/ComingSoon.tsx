import Image from "next/image";
import { RadialGradientOverlay } from "../Overlays";
import Link from "next/link";

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

export const ComingSoonSlide = ({ data }: { data: SlideData }) => {
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
            <div
              // href={`/${data.section}/${data.slug}`}
              className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white font-archivo font-bold px-10 py-4 hover:bg-white hover:text-[#2c2c2c] transition-all cursor-not-allowed"
            >
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
