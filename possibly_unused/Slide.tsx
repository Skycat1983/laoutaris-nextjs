import Image from "next/image";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

// ? USUSED?

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
const Slide = ({ slide }: HeroSlideProps) => {
  const { image, backgroundAdjustments, overlay } = slide;
  const backgroundStyle = {
    // backgroundImage: `url(${image.url})`,
    backgroundPosition: backgroundAdjustments.position,
    backgroundSize: backgroundAdjustments.size,
  };

  return (
    <div className="relative h-auto max-h-[700px]  w-full overflow-hidden">
      <Image
        src={image.url}
        height={slide.height}
        width={slide.width}
        className="relative lg:bottom-[50px] cover"
        // objectFit="contain"
        alt="bla"
      />
    </div>
  );
};

export default Slide;

{
  /* <div
        className="bg-no-repeat bg-cover bg-center h-[500px] md:h-[800px] w-full"
        style={backgroundStyle}
      > */
}
{
  /* <div
          className="absolute top-0 left-0 w-full h-full grid grid-cols-12 z-0"
          style={{ gridTemplateRows: "repeat(12, minmax(0, auto))" }}
        >
          {overlay}

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
            className={`${image.link.className} col-span-4 row-start-4 row-end-5 z-0`}
          >
            {image.link.text}
          </Link>
        </div> */
}
{
  /* </div> */
}
