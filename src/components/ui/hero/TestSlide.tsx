import React from "react";
import { CldImage } from "next-cloudinary";

type Props = {};

const TestSlide = () => {
  const url = "artwork/lapbp1anawjzvayajq3s";
  const gravity = "west";
  const x = 280;
  const fontSize = 100;
  const color = "White";
  const fontFamily = "Archivo Black";

  return (
    <>
      <CldImage
        src={url}
        className="relative lg:bottom-[50px] cover"
        width={3504}
        height={2927}
        alt="bla"
        overlays={[
          {
            position: {
              x: x,
              y: 120,
              gravity: gravity,
            },
            text: {
              color: color,
              fontFamily: fontFamily,
              fontSize: fontSize,
              text: "Browse the",
            },
          },
          {
            position: {
              x: x,
              y: 240,
              gravity: gravity,
            },
            text: {
              color: color,
              fontFamily: fontFamily,
              fontSize: fontSize,
              text: "archive of large-",
            },
          },
          {
            position: {
              x: x,
              y: 360,
              gravity: gravity,
            },
            text: {
              color: color,
              fontFamily: fontFamily,
              fontSize: fontSize,
              text: "scale works",
            },
          },
        ]}
      />
    </>
  );
};

export default TestSlide;

// sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

// <div className="relative h-auto max-h-[700px]  w-full overflow-hidden">

// </div>

{
  /* <Image
    src={image.url}
    height={slide.height}
    width={slide.width}
    className="relative lg:bottom-[50px] cover"
    // objectFit="contain"
    alt="bla"
  /> */
}
