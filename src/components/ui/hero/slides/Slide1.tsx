"use client";

import React from "react";
import { CldImage } from "next-cloudinary";
import { RadialGradientOverlay } from "../Overlays";

const Slide1 = () => {
  const url = "artwork/lapbp1anawjzvayajq3s";
  const gravity = "north_west";
  const x = 280;
  const fontSize = 100;
  const color = "White";
  const fontFamily = "Archivo Black";
  const y = 450;
  const incrementY = 120;

  const overlays = ["Browse the", "archive of large-", "scale works"].map(
    (text, index) => ({
      position: {
        x: x,
        y: y + index * incrementY,
        gravity: gravity,
      },
      text: {
        color: color,
        fontFamily: fontFamily,
        fontSize: fontSize,
        text: text,
      },
    })
  );

  const overlayMD = ["Browse the", "archive of large-", "scale works"].map(
    (text, index) => ({
      position: {
        x: x,
        y: y + index * 200,
        gravity: gravity,
      },
      text: {
        color: color,
        fontFamily: fontFamily,
        fontSize: 200,
        text: text,
      },
    })
  );

  return (
    <div className="bg-red-400 max-h-[800px] w-full ">
      <RadialGradientOverlay />
      <CldImage
        className="hidden lg:block"
        src={url}
        width={3504}
        height={2927}
        aspectRatio="16:9"
        crop={{
          type: "crop",
          width: 3504,
          height: 2927,
          x: 80,
          y: 250,
          gravity: "north",
          source: true,
        }}
        gravity="south"
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 50vw"
        alt="Responsive Test Slide"
        overlays={overlays}
      />
      <CldImage
        className="block lg:hidden"
        src={url}
        width={3504}
        height={2927}
        aspectRatio="16:9"
        crop={{
          type: "crop",
          width: 3504,
          height: 2927,
          x: 80,
          y: 250,
          gravity: "north",
          source: true,
        }}
        gravity="south"
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 50vw"
        alt="Responsive Test Slide"
        overlays={overlayMD}
      />
    </div>
  );
};

export default Slide1;

// const TestSlide = () => {
//   const url = "artwork/lapbp1anawjzvayajq3s";
//   const gravity = "north_west";
//   const x = 280;
//   const fontSize = 100;
//   const color = "White";
//   const fontFamily = "Archivo Black";

//   // className="relative lg:bottom-[50px] cover"

//   return (
//     <>
//       <div className="relative h-auto max-h-[700px]  w-full overflow-hidden">

//         <CldImage
//           src={url}
//           width={3504}
//           height={2927}
//           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
//           // sizes="(max-width: 640px) 10vw, (max-width: 1024px) 10vw, 33vw"
//           alt="bla"
//           overlays={[
//             {
//               position: {
//                 x: x,
//                 y: 120,
//                 gravity: gravity,
//               },
//               text: {
//                 color: color,
//                 fontFamily: fontFamily,
//                 fontSize: fontSize,
//                 text: "Browse the",
//               },
//             },
//             {
//               position: {
//                 x: x,
//                 y: 240,
//                 gravity: gravity,
//               },
//               text: {
//                 color: color,
//                 fontFamily: fontFamily,
//                 fontSize: fontSize,
//                 text: "archive of large-",
//               },
//             },
//             {
//               position: {
//                 x: x,
//                 y: 360,
//                 gravity: gravity,
//               },
//               text: {
//                 color: color,
//                 fontFamily: fontFamily,
//                 fontSize: fontSize,
//                 text: "scale works",
//               },
//             },
//           ]}
//         />
//       </div>
//     </>
//   );
// };

// export default TestSlide;
