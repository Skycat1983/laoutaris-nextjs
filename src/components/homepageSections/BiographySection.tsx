import Image from "next/image";
import ButtonDivider from "../atoms/ButtonDivider";
import HorizontalDivider from "../atoms/HorizontalDivider";
import SectionHeading from "../atoms/SectionHeading";
import { ScrollArea, ScrollBar } from "../ui/shadcn/scroll-area";
import Link from "next/link";
import { ReactNode } from "react";

interface BiographyEntry {
  title: string;
  subtitle: string;
  imageUrl: string;
  slug: string;
}

interface BiographySectionProps {
  biographyEntries: BiographyEntry[];
}

const BiographyLinkWrapper: React.FC<{ to: string; children: ReactNode }> = ({
  to,
  children,
}) => {
  return <Link href={to}>{children}</Link>;
};

const BiographySection: React.FC<BiographySectionProps> = ({
  biographyEntries,
}) => {
  return (
    <>
      <SectionHeading
        heading="Biography:"
        subheading="Read my grandfather's story"
      />
      <HorizontalDivider />
      {/* <ScrollArea className="container whitespace-nowrap rounded-md h-64"> */}
      <section className="p-4 flex w-max space-x-4 h-[500px] mx-auto bg-red-100">
        {biographyEntries.map((entry, index) => (
          <BiographyLinkWrapper to={`/biography/${entry.slug}`} key={index}>
            <div key={index} className="flex flex-col">
              <div className="relative h-[300px] w-full overflow-hidden">
                <Image
                  src={entry.imageUrl}
                  alt={entry.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="flex flex-col gap-4 p-4 w-[250px] whitespace-normal text-center pt-8">
                <h1 className="font-archivo text-2xl font-bold break-words">
                  {entry.title}
                </h1>
                <h2 className="font-archivo text-xl font-normal text-gray-500 break-words">
                  {entry.subtitle}
                </h2>
              </div>
            </div>
          </BiographyLinkWrapper>
        ))}
      </section>
      {/* <ScrollBar orientation="horizontal" /> */}
      {/* </ScrollArea> */}

      <ButtonDivider label="Read more" link="/biography" />
    </>
  );
};

export default BiographySection;

// const biographyEntries = [
//   {
//     title: "Early Years",
//     subheading: "The roots of his passion",
//     to: "/biography/early-years",
//     url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361077/artwork/mv4jqdtm2dki3cdkxmwe.jpg",
//   },
//   {
//     title: "Meeting Beryl",
//     subheading: "A Partnership of Principles",
//     to: "/biography/meeting-beryl",
//     url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1714031333/artwork/ew7dr3stgdh03j4t0bma.jpg",
//   },
//   {
//     title: "Ethos",
//     subheading: "Old-Fashioned in a New World",
//     to: "/biography/ethos-technique",

//     url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361256/artwork/tdg3bdta3qafjwvavqie.jpg",
//   },

//   {
//     title: "Later Years",
//     subheading: "A Legacy of Love",
//     to: "/biography/later-years",
//     url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713360313/artwork/e27oevvokbriq3dio1al.jpg",
//   },
//   {
//     title: "Obituary",
//     subheading: "A life remembered",
//     to: "/biography/obituary",
//     url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713360414/artwork/fvcsx991quwdwnqdb2va.jpg",
//   },
// ];

{
  /* <ScrollArea className="container whitespace-nowrap rounded-md h-auto bg-blue-100">
        <section className="p-4 flex w-max space-x-4 h-[500px]">
          {biographyEntries.map((artwork, index) => (
            <div key={index} className="flex flex-col">
              <div className="relative h-[250px] w-[200px] overflow-hidden">
                <Image
                  src={artwork.url}
                  alt={artwork.title}
                  width={500}
                  height={500}
                />
              </div>
              <div className="flex flex-col gap-8 p-4 py-8 w-[100px] flex-wrap">
                <h1 className="font-archivo text-2xl font-bold">
                  {artwork.title}
                </h1>
                <h2 className="font-archivo text-xl font-normal text-gray-500">
                  {artwork.subheading}
                </h2>
              </div>
            </div>
          ))}
        </section>
        <ScrollBar orientation="horizontal" className="" />
      </ScrollArea> */
}

// <>
//   <SectionHeading
//     heading="Biography:"
//     subheading="Read my grandfather's story"
//   />
//   <HorizontalDivider />
//   <ScrollArea className="container whitespace-nowrap rounded-md h-auto bg-blue-100">
//     <section className="grid grid-cols-4 grid-rows-2 w-max py-8 gap-5">
//       {biographyEntries.map((artwork, index) => (
//         <div key={index} className="relative row-span-1 col-span-1 h-64">
//           <BiographyCard entry={artwork} key={index} />
//         </div>
//       ))}
//     </section>
//     <ScrollBar orientation="horizontal" className="" />
//   </ScrollArea>

//   <ButtonDivider label="Read more" link="/biography" />
// </>
