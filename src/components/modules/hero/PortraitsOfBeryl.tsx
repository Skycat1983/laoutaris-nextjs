import useImageCycle from "@/hooks/useImageCycle";
import Image from "next/image";
import Link from "next/link";

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

const data = {
  _id: { $oid: "65a4f7c9e4b0a3d1f0e12345" },
  title: "Beryl",
  subtitle: "Portraits of my grandmother",
  summary:
    "A collection of portraits of my grandmother, Beryl, painted over the years.",
  text: "Abstract art has transformed the way we perceive creativity. From Kandinsky to Pollock, artists have pushed the boundaries of form and meaning.",
  imageUrls: [
    "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_2000,w_1400,g_west/v1713982689/artwork/xexbkermnflwwz3ubdtm.jpg",
    "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_2000,w_1400,g_east/v1713982689/artwork/xexbkermnflwwz3ubdtm.jpg",
  ],
  section: "art-history",
  slug: "exploring-abstract-art",
  artworks: [
    { $oid: "65a4f7c9e4b0a3d1f0e67890" },
    { $oid: "65a4f7c9e4b0a3d1f0e09876" },
  ],
  readOnly: false,
  createdAt: { $date: "2025-03-08T12:00:00.000Z" },
  updatedAt: { $date: "2025-03-08T12:30:00.000Z" },
  __v: 0,
};

export const PortraitsOfBeryl2 = () => {
  const west = "g_west";
  const east = "g_east";
  const crop = "c_crop,h_2000,w_1400";

  const imageWest = `https://res.cloudinary.com/dzncmfirr/image/upload/${crop},${west}/v1713982689/artwork/xexbkermnflwwz3ubdtm.jpg`;
  const imageEast = `https://res.cloudinary.com/dzncmfirr/image/upload/${crop},${east}/v1713982689/artwork/xexbkermnflwwz3ubdtm.jpg`;

  const image = [imageWest, imageEast];
  const { currentImage, nextImage } = useImageCycle(image);

  return (
    <div className="relative h-[850px] w-full overflow-hidden bg-[#232323]">
      <div
        className="absolute right-0 h-full w-[50%] overflow-hidden cursor-pointer"
        // onClick={nextImage}
      >
        <Image
          src={imageWest}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover object-center"
          sizes="50vw"
        />
      </div>
      <div
        className="absolute left-0 h-full w-[50%] overflow-hidden cursor-pointer blur-md"
        onClick={nextImage}
      >
        <Image
          src={imageEast}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover object-center"
          sizes="50vw"
        />
      </div>
      <div
        className="absolute left-0 h-full w-[50%] overflow-hidden cursor-pointer bg-black/30"
        onClick={nextImage}
      >
        {/* <Image
          src={imageEast}
          alt={data.title}
          fill
          quality={100}
          priority={true}
          className="object-cover object-center"
          sizes="50vw"
        /> */}
      </div>
      {/* <div className="absolute left-0 h-full w-[45%] flex">
        <div className="flex-1 flex flex-col justify-center px-16 ml-12">
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
      </div> */}
    </div>
  );
};

export const PortraitsOfBeryl = () => {
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
          className="object-cover object-center  slow-slide"
          sizes="55vw"
        />
      </div>
      <div className="absolute left-0 h-full w-[45%] flex">
        <div className="flex-1 flex flex-col justify-center px-16 ml-12">
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
