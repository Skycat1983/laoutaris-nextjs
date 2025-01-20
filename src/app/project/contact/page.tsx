import TransitionGroup from "@/components/animations/TransitionGroup";
import HorizontalDivider from "@/components/ui/common/HorizontalDivider";
import ContactForm from "@/components/ui/forms/ContactForm";
import EnquiryForm from "@/components/ui/forms/EnquiryForm";
import Image from "next/image";
import { Suspense } from "react";

export default function Contact() {
  const article = {
    title: "Contact us",
    subtitle: "The Project",
    summary: "Contact us",
    text: "My grandfather's work is freely available to any gallery or organisation that can put it on display to the public. If you are interested in hosting an exhibition, or want to get involved in any way at all, please get in touch.",
    overlayColour: "black",
    author: "Heron Laoutaris",
    imageUrl:
      "https://res.cloudinary.com/dzncmfirr/image/upload/v1706776926/studio-thumbnails/JRL_studio1_012_smdlzw.jpg",
    slug: "about",
    section: "project",
    image: {
      secure_url:
        "https://res.cloudinary.com/dzncmfirr/image/upload/v1706776926/studio-thumbnails/JRL_studio1_012_smdlzw.jpg",
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
          <ContactForm />
          {/* <article className="prose-xl text-left p-24 bg-white fade-in">
            {article.text.split("\r\n\r\n").map((paragraph, index) => (
              <p key={index} className="m-2 leading-8 prose-lg">
                {paragraph}
              </p>
            ))}
          </article> */}
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

            <ContactForm />

            {/* <article className="prose-xl text-left fade-in">
              <h1 className="text-2xl font-bold font-archivoBlack my-5">
                {article.summary}
              </h1>
              <div className="h-[2px] w-full bg-gray-500 my-10"></div>
              {article.text.split("\r\n\r\n").map((paragraph, index) => (
                <p key={index} className="m-2 leading-8 prose-lg py-2">
                  {paragraph}
                </p>
              ))}
            </article> */}
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
