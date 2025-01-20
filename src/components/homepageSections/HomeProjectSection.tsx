import SectionHeading from "../ui/common/SectionHeading";
import HorizontalDivider from "../ui/common/HorizontalDivider";
import YoutubeEmbedding from "../ui/common/YoutubeEmbedding";
import ButtonDivider from "../ui/common/ButtonDivider";
import { delay } from "@/utils/debug";

const HomeProjectSection = async () => {
  await delay(2000);
  return (
    <div className="p-4 w-full">
      <SectionHeading heading="Project:" subheading="Watch the documentary" />
      <section
        data-testid="project-content"
        className="relative my-10 bg-gray-100"
      >
        <HorizontalDivider />

        <div className="grid grid-cols-2 lg:grid-cols-3 items-center h-full">
          <div className="col-span-3 xl:col-span-2">
            <YoutubeEmbedding />
          </div>
          <div className="col-span-3 xl:col-span-1 z-1 mx-10 my-8 xl:my-4">
            <div className="ml-10 border-l border-black border-l-4">
              <h1 className="text-black z-1 font-archivo bold text-3xl text-left ml-8">
                The life, ethos & regrets of Joseph Laoutaris
              </h1>
            </div>
            <div className="ml-10">
              <h3 className="font-archivo text-xl text-left mx-10 text-gray-600 my-10">
                A short film about my grandfather
              </h3>
            </div>
            <div className="ml-10">
              <h3 className="font-archivo text-xl text-left mx-10 text-gray-800 my-10">
                By Heron Laoutaris
              </h3>
            </div>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-4 grid-rows-2 w-full py-0 gap-5"></div>
      <ButtonDivider label="Learn more" link="/project" />
    </div>
  );
};

export { HomeProjectSection };
