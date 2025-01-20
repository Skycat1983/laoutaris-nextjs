"use server";

import ButtonDivider from "../ui/common/ButtonDivider";
import HorizontalDivider from "../ui/common/HorizontalDivider";
import SectionHeading from "../ui/common/SectionHeading";
import { ScrollArea, ScrollBar } from "../ui/shadcn/scroll-area";
import BiographyCard from "../ui/cards/biographyCard/BiographyCard";
import { delay } from "@/utils/debug";
import { getHomepageArticleSectionData } from "@/lib/server/article/use_cases/getHomepageArticleSectionData";

const HomeBiographySection: React.FC = async () => {
  await delay(2000);
  const homeBiographaphySectionCardData = await getHomepageArticleSectionData();

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
          {homeBiographaphySectionCardData.map((entry, index) => (
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
