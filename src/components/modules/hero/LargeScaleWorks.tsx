import Image from "next/image";
import Link from "next/link";
import { RadialGradientOverlay } from "./Overlays";

// const LargeScaleWorks = () => {
//   const PLACEHOLDER_URL =
//     "https://res.cloudinary.com/dzncmfirr/image/upload/v1713359817/artwork/lapbp1anawjzvayajq3s.jpg";

//   return (
//     <div className="relative h-[850px] w-screen overflow-hidden">
//       <Image
//         src={PLACEHOLDER_URL}
//         layout="fill"
//         objectFit="cover"
//         alt="Browse our collection"
//         quality={100}
//         priority={true}
//         className="scale-110"
//       />

//       <div className="absolute inset-0 flex items-end justify-center pb-48 sm:pb-24 p-8">
//         <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-8 rounded-lg w-[90%] sm:w-[600px] shadow-xl text-center mx-4">
//           <h1 className="text-2xl sm:text-3xl font-cormorant text-gray-900 mb-4 sm:mb-6">
//             Explore the Collection
//           </h1>
//           <div className="space-y-4 sm:space-y-6">{/*  */}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export { LargeScaleWorks };
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
    <div className="relative h-[850px] w-screen overflow-hidden">
      <Image
        src={image.url}
        // height={slide.height}
        // width={slide.width}
        // alt="Image of a large scale artwork"
        // quality={100}
        // sizes="100vw"
        // priority={true}
        layout="fill"
        objectFit="cover"
        alt="Browse our collection"
        quality={100}
        priority={true}
        className="scale-110"
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
