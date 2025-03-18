import Image from "next/image";
import Link from "next/link";
import { RadialGradientOverlay } from "../Overlays";

const LargeScaleWorks = () => {
  const originalImg =
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1713359817/artwork/lapbp1anawjzvayajq3s.jpg";

  const slide = {
    width: 3504,
    height: 2927,
    image: {
      url: originalImg,
      heading: {
        text: "Browse the archive of large-scale works",
        className:
          "text-4xl col-start-2 col-end-10 row-start-5 row-end-6 md:col-start-2 md:col-end-8 lg:col-start-2 lg:col-end-5 lg:row-start-5 lg:row-end-6 text-left z-20 md:text-5xl font-archivoBlack text-white",
      },
      subheading: "text",
      summary: "text",
      link: {
        path: "/collections/xxl",
        text: "Browse",
        className:
          "col-start-2 col-end-10 row-start-6 row-end-7 lg:col-start-2 lg:col-end-5 lg:row-start-6 lg:row-end-7 flex flex-row items-center justify-center border border-black bg-black text-center text-lg font-bold font-archivo text-white w-1/2 h-[50px] w-[240px] py-[10px] z-20",
      },
    },
    backgroundAdjustments: {
      position: "0% 34%",
      size: "120%",
    },
    overlay: <RadialGradientOverlay />,
  };
  const { image } = slide;

  return (
    <div className="relative h-[850px] w-screen overflow-hidden">
      <Image
        src={image.url}
        layout="fill"
        objectFit="cover"
        alt="Browse our collection"
        quality={100}
        priority={true}
        className="scale-110 z-0"
      />
      <RadialGradientOverlay />
      <div
        className="absolute inset-0 grid grid-cols-12 z-10"
        style={{ gridTemplateRows: "repeat(12, minmax(0, auto))" }}
      >
        <RadialGradientOverlay />

        {image.heading && (
          <h1 className={image.heading.className}>{image.heading.text}</h1>
        )}
        <Link href={image.link.path} className={image.link.className}>
          {image.link.text}
        </Link>
      </div>
    </div>
  );
};

export { LargeScaleWorks };
