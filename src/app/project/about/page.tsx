import TransitionGroup from "@/components/animations/TransitionGroup";
import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import { IFrontendReducedArticleArtwork } from "@/lib/client/types/articleTypes";
import ArticleView from "@/views/ArticleView";
import MobileArticleView from "@/views/MobileArticleView";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

export interface IFrontendPlaceholderArticle {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: any;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  overlayColour: "white" | "black";
  image: {
    secure_url: string;
    pixelHeight: number;
    pixelWidth: number;
  };
}

export default function About() {
  const article: IFrontendPlaceholderArticle = {
    title: "About",
    subtitle: "The Project",
    summary: "Shining a spotlight on the life and work of an unsung artist",
    text: "Joseph Laoutaris, my grandfather, is a passionate and eccentric artist who dedicated his life to painting in isolation. Critically acclaimed in the 50s, Victor Musgrave invited him to exhibit at Gallery One, while Lillian Browse offered him a one-man show at the prestigious Rowland, Browse and Delbanco Gallery in London.\r\n\r\nFurther invitations followed, most notably from Bryan Robertson while he was director of the Whitechapel Gallery. However, deeply uncomfortable in the company of other people—and in rejection of emergent artistic trends—he shunned all opportunities to promote his work. Instead, he lived as a hermit; working tirelessly from within his London apartment.\r\n\r\nIndeed, my grandfather cared not for fame, money, nor approval. Instead, he opted to refine his technique, alone and in secret, while being supported by my grandmother, who sadly took her own life 17 years ago. My grandmother had always hoped he would gain some recognition for his talents. Now nearing the end of his life, this has come to haunt him. To this day, he continues to paint every day, unabated by the life choices he has come to regret—but he now finds solace in the thought that someday his work might be enjoyed by the public.\r\n\r\nThis website is part of a project to help my grandfather get the recognition he deserves.",
    overlayColour: "black",
    author: "Heron Laoutaris",
    imageUrl:
      "https://res.cloudinary.com/dzncmfirr/image/upload/v1706776929/studio-thumbnails/JRL_studio1_009_mo28hr.jpg",
    slug: "about",
    section: "project",
    image: {
      secure_url:
        "https://res.cloudinary.com/dzncmfirr/image/upload/v1706776929/studio-thumbnails/JRL_studio1_009_mo28hr.jpg",
      pixelHeight: 1067,
      pixelWidth: 1600,
    },
  };

  return (
    <main className="flex flex-col items-center justify-between lg:px-12 py-4">
      <div className="block md:hidden">
        <div
          className="bg-cover  bg-fixed h-[530px] fade-in"
          style={{
            backgroundImage: `url(${article.image.secure_url})`,
            // backgroundPosition: "90% -100px",
          }}
        >
          <div className="flex flex-row w-full h-[250px] p-[80px] justify-center relative sticky top-[120px]">
            <TransitionGroup
              appear={true}
              isShowing={true}
              textColour={article.overlayColour}
              title={article.title}
              subtitle={article.subtitle}
              author="Heron Laoutaris" // TODO: Replace with actual author
            />
          </div>
        </div>

        <div className="flex flex-col justify-start items-start bg-slate-100/50 relative bottom-[200px]">
          <article className="prose-xl text-left p-24 bg-white fade-in">
            {article.text.split("\r\n\r\n").map((paragraph, index) => (
              <p key={index} className="m-2 leading-8 prose-lg">
                {paragraph}
              </p>
            ))}
          </article>
        </div>

        {/* <div className="flex flex-row w-full justify-center items-center px-[80px] gap-5">
        {prevUrl ? (
          <Link href={prevUrl} className="bg-black text-white w-full">
            <button className="bg-black text-white p-4 w-full">Previous</button>
          </Link>
        ) : (
          <button
            className="bg-gray-400 text-gray-600 p-4 w-full cursor-not-allowed"
            disabled
          >
            Previous
          </button>
        )}

        {nextUrl ? (
          <Link href={nextUrl} className="bg-black text-white w-full">
            <button className="bg-black text-white p-4 w-full">Next</button>
          </Link>
        ) : (
          <button
            className="bg-gray-400 text-gray-600 p-4 w-full cursor-not-allowed"
            disabled
          >
            Next
          </button>
        )}
      </div> */}
      </div>
      <div className="hidden md:block">
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
              <Suspense
                fallback={<div className="bg-blue-500">Loading...</div>}
              >
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
            {/* <div className="flex flex-row w-full justify-center items-center pt-[50px] gap-5">
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
          </div> */}
          </div>
        </div>
        <div className="p-10">
          <HorizontalDivider />
        </div>
      </div>
    </main>
  );
}
