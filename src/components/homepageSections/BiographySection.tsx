import Image from "next/image";
import ButtonDivider from "../atoms/ButtonDivider";
import HorizontalDivider from "../atoms/HorizontalDivider";
import SectionHeading from "../atoms/SectionHeading";
import Link from "next/link";
import { ReactNode } from "react";
import { ScrollArea, ScrollBar } from "../ui/shadcn/scroll-area";

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
      <ScrollArea className="container whitespace-nowrap rounded-md h-[500px]">
        <section className="p-4 flex w-max space-x-4 h-[500px] mx-auto">
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <ButtonDivider label="Read more" link="/biography" />
    </>
  );
};

export default BiographySection;

// const BiographySection: React.FC<BiographySectionProps> = ({
//   biographyEntries,
// }) => {
//   return (
//     <>
//       <SectionHeading
//         heading="Biography:"
//         subheading="Read my grandfather's story"
//       />
//       <HorizontalDivider />
//       <section className="p-4 flex w-max space-x-4 h-[500px] mx-auto bg-red-100">
//         {biographyEntries.map((entry, index) => (
//           <BiographyLinkWrapper to={`/biography/${entry.slug}`} key={index}>
//             <div key={index} className="flex flex-col">
//               <div className="relative h-[300px] w-full overflow-hidden">
//                 <Image
//                   src={entry.imageUrl}
//                   alt={entry.title}
//                   fill
//                   style={{ objectFit: "cover" }}
//                 />
//               </div>
//               <div className="flex flex-col gap-4 p-4 w-[250px] whitespace-normal text-center pt-8">
//                 <h1 className="font-archivo text-2xl font-bold break-words">
//                   {entry.title}
//                 </h1>
//                 <h2 className="font-archivo text-xl font-normal text-gray-500 break-words">
//                   {entry.subtitle}
//                 </h2>
//               </div>
//             </div>
//           </BiographyLinkWrapper>
//         ))}
//       </section>

//       <ButtonDivider label="Read more" link="/biography" />
//     </>
//   );
// };

// export default BiographySection;
