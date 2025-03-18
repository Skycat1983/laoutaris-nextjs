import Image from "next/image";
import { DimmedOverlay } from "../Overlays";
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

export const FamilyFavourites = ({ data }: { data: SlideData }) => {
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
