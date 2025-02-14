import Image from "next/image";
import Link from "next/link";
import { DimmedOverlay } from "./Overlays";

const FamilyFavourites = () => {
  const slide = {
    height: 3504,
    width: 2723,
    image: {
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361125/artwork/s6ut8kg4oxst7g4yefiv.jpg",
      heading: {
        text: "Family Favourites",
        className:
          "text-white col-start-2 col-end-10 row-start-5 row-end-5 lg:col-start-9 lg:col-end-12 lg:row-start-5 lg:row-end-5 text-left overlay-text font-cormorant text-5xl pl-10 border-l-[6px] border-white",
      },
      subheading: {
        text: "A curated collection",
        className:
          "text-white col-start-2 col-end-10 row-start-6 row-end-6 lg:col-start-9 lg:col-end-12 lg:row-start-6 lg:row-end-6 text-left overlay-text font-archivo font-bold text-2xl pl-10 border-l-[6px] border-white h-min",
      },
      summary: {
        text: "A beloved piece chosen by each of his grandchildren",
        className:
          "text-white col-start-2 col-end-10 row-start-7 row-end-7  lg:col-start-9 lg:col-end-12 lg:row-start-7 lg:row-end-7 text-left overlay-text font-archivo text-xl ml-10",
      },
      link: {
        path: "/artwork",
        text: "Browse",
        className:
          "text-white col-start-2 col-end-10 row-start-8 row-end-8 lg:col-start-9 lg:col-end-12 lg:row-start-8 lg:row-end-8 flex flex-row items-center justify-center border border-black bg-black text-center text-lg font-bold font-archivo text-white w-2/3 h-[50px] w-[240px] ml-10",
      },
    },
    backgroundAdjustments: {
      position: "center 43%",
      size: "100%",
    },
    overlay: <DimmedOverlay />,
  };
  const { image, backgroundAdjustments, overlay } = slide;
  //  <div className="relative h-auto max-h-[700px]  w-full overflow-hidden">
  return (
    <div className="relative h-auto max-h-[700px] w-full overflow-hidden 2xl:max-h-[850px]">
      <Image
        src={image.url}
        height={slide.height}
        width={slide.width}
        className="relative min-w-[200px] lg:bottom-[100px] xl:bottom-[250px] cover z-0"
        alt="Image of a landscape painting"
        quality={100}
        priority={true}
      />
      <div
        className="absolute top-0 left-0 w-full h-full grid grid-cols-12 z-0"
        style={{ gridTemplateRows: "repeat(12, minmax(0, auto))" }}
      >
        <DimmedOverlay />

        {image.heading && (
          <h1
            className={`${image.heading.className} col-span-4 row-start-1 row-end-2 z-0`}
          >
            {image.heading.text}
          </h1>
        )}
        {image.subheading && (
          <h2
            className={`${image.subheading.className} col-span-4 row-start-2 row-end-3 z-0`}
          >
            {image.subheading.text}
          </h2>
        )}
        {image.summary && (
          <p
            className={`${image.summary.className} col-span-4 row-start-3 row-end-4 z-0`}
          >
            {image.summary.text}
          </p>
        )}
        <Link
          href={image.link.path}
          className={`${image.link.className} col-span-4 row-start-5 row-end-6 z-0`}
        >
          {image.link.text}
        </Link>
      </div>
    </div>
  );
};

export default FamilyFavourites;
