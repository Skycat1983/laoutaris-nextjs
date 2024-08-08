import Image from "next/image";
import Link from "next/link";
import { RadialGradientOverlay } from "./Overlays";

export interface IHeroSlide {
  image: HeroContent;
  backgroundAdjustments: HeroBackground;
  overlay: React.ReactElement | null;
  height: number;
  width: number;
}

interface HeroContent {
  url: string;
  heading: HeroTextItem | null;
  subheading: HeroTextItem | null;
  summary: HeroTextItem | null;
  link: HeroLink;
}

interface HeroTextItem {
  text: string;
  className: string;
}

interface HeroLink extends HeroTextItem {
  path: string;
}

interface HeroBackground {
  position: string;
  size: string;
}

interface HeroSlideProps {
  slide: IHeroSlide;
}
const LargeScaleWorks = () => {
  const slide = {
    width: 3504,
    height: 2927,
    image: {
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713359817/artwork/lapbp1anawjzvayajq3s.jpg",
      heading: {
        text: "Browse the archive of large-scale works",
        className:
          "col-start-2 col-end-10 row-start-4 row-end-4 md:col-start-2 md:col-end-8 lg:col-start-2 lg:col-end-5 lg:row-start-4 lg:row-end-5 text-left z-10 text-5xl font-archivoBlack text-white",
      },

      subheading: null,
      summary: null,
      link: {
        path: "/artwork",
        text: "Browse",
        className:
          "col-start-2 col-end-10 row-start-5 row-end-8 lg:col-start-2 lg:col-end-5 lg:row-start-5 lg:row-end-6 flex flex-row items-center justify-center border border-black bg-black text-center text-lg font-bold font-archivo text-white w-1/2 h-[50px] w-[240px] py-[10px]",
      },
    },
    backgroundAdjustments: {
      position: "0% 34%",
      size: "120%",
    },
    overlay: <RadialGradientOverlay />,
  };
  const { image, backgroundAdjustments, overlay } = slide;

  return (
    <div className="relative h-auto max-h-[700px] w-full overflow-hidden">
      <Image
        src={image.url}
        height={slide.height}
        width={slide.width}
        className="relative min-w-[200px] lg:bottom-[100px] xl:bottom-[210px] cover z-10"
        alt="Image of a large scale artwork"
      />
    </div>
  );
};

export default LargeScaleWorks;
