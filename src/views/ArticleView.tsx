import TransitionGroup from "@/components/animations/TransitionGroup";
import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import { Button } from "@/components/ui/shadcn/button";
import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

interface ArticleProps {
  article: IFrontendArticle;
  nextUrl: string | null;
  prevUrl: string | null;
}

const ArticleView: React.FC<ArticleProps> = ({ article, nextUrl, prevUrl }) => {
  return (
    <>
      <div className="grid grid-cols-7 grid-rows-1 w-full h-full">
        <div className="col-start-1 col-end-5 row-start-1 row-end-1 h-full z-1 relative">
          <div className="flex flex-row w-full p-10 justify-end relative sticky top-[200px]">
            <div>
              <TransitionGroup
                appear={true}
                isShowing={true}
                textColour={article.overlayColour}
                title={article.title}
                subtitle={article.subtitle}
                author="Heron Laoutaris"
              />
            </div>
          </div>
        </div>
        <div className="col-start-1 col-end-5 row-start-1 row-end-1 h-full place-start z-negative">
          <div className="flex flex-col h-full justify-start items-start align-start">
            <Suspense fallback={<div className="bg-blue-500">Loading...</div>}>
              <Image
                src={article.imageUrl}
                alt={article.title}
                width={1920}
                height={1080}
                className="my-bg h-full object-cover shadow-lg fade-in"
              />
            </Suspense>
          </div>
        </div>
        <div className="col-start-5 col-end-8 row-start-1 row-end-1 flex flex-col justify-start items-start md:mx-[50px] lg:mx-[70px] xl:mx-[90px] mt-8">
          <article className="prose-xl text-left fade-in">
            <h1 className="text-2xl font-bold font-archivoBlack my-5">
              {article.summary}
            </h1>
            <div className="h-[2px] w-full bg-gray-500 my-10"></div>
            {article.text.split("\r\n\r\n").map((paragraph, index) => (
              <p key={index} className="m-2 leading-8 prose-lg py-2">
                {paragraph}
              </p>
            ))}
          </article>
          <div className="flex flex-row w-full justify-center items-center pt-[50px] gap-5">
            {prevUrl ? (
              <Link href={prevUrl} className="bg-black text-white w-full">
                <Button size={"full"}>Prev</Button>
              </Link>
            ) : (
              <Button size={"full"} variant={"ghost"}>
                Prev
              </Button>
            )}
            {nextUrl ? (
              <Link href={nextUrl} className="bg-black text-white w-full">
                <Button size={"full"}>Next</Button>
              </Link>
            ) : (
              <Button size={"full"} variant={"ghost"}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="p-10">
        <HorizontalDivider />
      </div>
    </>
  );
};

export default ArticleView;

// ! working version, before changes
// const ArticleView: React.FC<ArticleProps> = ({ article, nextUrl, prevUrl }) => {
//   const [overlayShowing, setOverlayShowing] = useState(true);
//   const imageRef = useRef<HTMLImageElement>(null);
//   const textRef = useRef<HTMLDivElement>(null);
//   // TODO: change img to nextjs Image
//   return (
//     <>
//       <div className="grid grid-cols-7 grid-rows-1 w-full h-full">
//         <div className="col-start-1 col-end-5 row-start-1 row-end-1 h-full z-1 relative">
//           <div className="flex flex-row w-full p-10 justify-end relative sticky top-[200px]">
//             <div>
//               {overlayShowing && (
//                 <TransitionGroup
//                   appear={true}
//                   isShowing={true}
//                   textColour={article.overlayColour}
//                   title={article.title}
//                   subtitle={article.subtitle}
//                   author="Heron Laoutaris" // TODO: Replace with actual author
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="col-start-1 col-end-5 row-start-1 row-end-1 h-full place-start z-negative">
//           <div className="flex flex-col h-full justify-start items-start align-start">
//             <img
//               ref={imageRef}
//               className="my-bg h-full object-cover w-full shadow-lg"
//               src={article.imageUrl}
//               onLoad={() => setOverlayShowing(true)}
//             />
//           </div>
//         </div>
//         <div className="col-start-5 col-end-8 row-start-1 row-end-1 flex flex-col justify-start items-start md:mx-[50px] lg:mx-[70px] xl:mx-[90px] mt-8">
//           <article className="prose-xl text-left" ref={textRef}>
//             <h1 className="text-2xl font-bold font-archivoBlack my-5">
//               {article.summary}
//             </h1>
//             <div className="h-[2px] w-full bg-gray-500 my-10"></div>
//             {article.text.split("\r\n\r\n").map((paragraph, index) => (
//               <p key={index} className="m-2 leading-8 prose-lg py-2">
//                 {paragraph}
//               </p>
//             ))}
//           </article>
//           <div className="flex flex-row w-full justify-center items-center pt-[50px] gap-5">
//             {prevUrl ? (
//               <Link href={prevUrl} className="bg-black text-white w-full">
//                 <Button size={"full"}>Prev</Button>
//               </Link>
//             ) : (
//               <Button size={"full"} variant={"ghost"}>
//                 Prev
//               </Button>
//             )}

//             {nextUrl ? (
//               <Link href={nextUrl} className="bg-black text-white w-full">
//                 <Button size={"full"}>Next</Button>
//               </Link>
//             ) : (
//               <Button size={"full"} variant={"ghost"}>
//                 Next
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="p-10">
//         <HorizontalDivider />
//       </div>
//     </>
//   );
// };

// export default ArticleView;
