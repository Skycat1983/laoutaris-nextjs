import Image from "next/image";
import Link from "next/link";
import { RadialGradientOverlay } from "./Overlays";

// ! not sure if needed
// export interface IHeroSlide {
//   image: HeroContent;
//   backgroundAdjustments: HeroBackground;
//   overlay: React.ReactElement | null;
//   height: number;
//   width: number;
// }

// interface HeroContent {
//   url: string;
//   heading: HeroTextItem | null;
//   subheading: HeroTextItem | null;
//   summary: HeroTextItem | null;
//   link: HeroLink;
// }

// interface HeroTextItem {
//   text: string;
//   className: string;
// }

// interface HeroLink extends HeroTextItem {
//   path: string;
// }

// interface HeroBackground {
//   position: string;
//   size: string;
// }

// interface HeroSlideProps {
//   slide: IHeroSlide;
// }
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
          "text-4xl col-start-2 col-end-10 row-start-5 row-end-6 md:col-start-2 md:col-end-8 lg:col-start-2 lg:col-end-5 lg:row-start-5 lg:row-end-6 text-left z-10 md:text-5xl font-archivoBlack text-white",
      },

      subheading: "text",
      summary: "text",
      link: {
        path: "/artwork",
        text: "Browse",
        className:
          "col-start-2 col-end-10 row-start-6 row-end-7 lg:col-start-2 lg:col-end-5 lg:row-start-6 lg:row-end-7 flex flex-row items-center justify-center border border-black bg-black text-center text-lg font-bold font-archivo text-white w-1/2 h-[50px] w-[240px] py-[10px]",
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
    <div className="relative h-auto max-h-[700px] w-full overflow-hidden 2xl:max-h-[850px]">
      <Image
        src={image.url}
        height={slide.height}
        width={slide.width}
        className="relative min-w-[200px] lg:bottom-[100px] xl:bottom-[210px] cover z-0"
        alt="Image of a large scale artwork"
        quality={100}
        priority={true}
      />
      <RadialGradientOverlay />
      <div
        className="absolute top-0 left-0 w-full h-full grid grid-cols-12 z-0"
        style={{ gridTemplateRows: "repeat(12, minmax(0, auto))" }}
      >
        {image.heading && (
          <h1
            className={`${image.heading.className} col-span-4 row-start-1 row-end-2 z-0`}
          >
            {image.heading.text}
          </h1>
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

export default LargeScaleWorks;
