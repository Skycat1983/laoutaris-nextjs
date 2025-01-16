"use server";

import ButtonDivider from "../atoms/ButtonDivider";
import HorizontalDivider from "../atoms/HorizontalDivider";
import SectionHeading from "../atoms/SectionHeading";
import { ScrollArea, ScrollBar } from "../ui/shadcn/scroll-area";
import { fetchArticles } from "@/lib/server/article/data-fetching/fetchArticles";
import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import BiographyCard from "../cards/biographyCard/BiographyCard";
import { delay } from "@/utils/debug";

type BiographyEntry = Pick<
  IFrontendArticle,
  "title" | "subtitle" | "imageUrl" | "slug"
>;

const HomeBiographySection: React.FC = async () => {
  await delay(2000);

  const biographyEntriesResponse = await fetchArticles<BiographyEntry[]>(
    "section",
    "biography",
    ["title", "subtitle", "slug", "imageUrl"]
  );

  if (!biographyEntriesResponse.success) {
    return (
      <p className="text-red-500">Error: {biographyEntriesResponse.message}</p>
    );
  }

  const biographyEntries = biographyEntriesResponse.data;

  // console.log("biographyEntries", biographyEntries);
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <SectionHeading
        heading="Biography:"
        subheading="Read my grandfather's story"
      />
      <HorizontalDivider />
      <ScrollArea className="container whitespace-nowrap rounded-md h-[500px]">
        <section
          className="p-4 flex w-max space-x-4 h-[500px] mx-auto"
          data-testid="biography-content"
        >
          {biographyEntries.map((entry, index) => (
            <BiographyCard entry={entry} key={index} />
          ))}
        </section>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <ButtonDivider label="Read more" link="/biography" />
    </div>
  );
};

export default HomeBiographySection;

// const BiographyLinkWrapper: React.FC<{ to: string; children: ReactNode }> = ({
//   to,
//   children,
// }) => {
//   return <Link href={to}>{children}</Link>;
// };

// <BiographyLinkWrapper to={`/biography/${entry.slug}`} key={index}>
//   <div key={index} className="flex flex-col">
//     <div className="relative h-[300px] w-full overflow-hidden">
//       <Image
//         src={entry.imageUrl}
//         alt={entry.title}
//         fill
//         style={{ objectFit: "cover" }}
//       />
//     </div>
//     <div className="flex flex-col gap-4 p-4 w-[250px] whitespace-normal text-center pt-8">
//       <h1 className="font-archivo text-2xl font-bold break-words">
//         {entry.title}
//       </h1>
//       <h2 className="font-archivo text-xl font-normal text-gray-500 break-words">
//         {entry.subtitle}
//       </h2>
//     </div>
//   </div>
// </BiographyLinkWrapper>
