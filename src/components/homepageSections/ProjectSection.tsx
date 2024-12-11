import SectionHeading from "../atoms/SectionHeading";
import HorizontalDivider from "../atoms/HorizontalDivider";
import YoutubeEmbedding from "../atoms/YoutubeEmbedding";
import ButtonDivider from "../atoms/ButtonDivider";

//! this version causes problems with empty space appearing below footer
const ProjectSection = () => {
  return (
    <>
      <SectionHeading heading="Project:" subheading="Watch the documentary" />
      {/* <div className="w-screen bg-gray-100 absolute left-0 h-[80%] xl:h-[520px] z-negative shadow-md"></div> */}

      <section className="relative my-10 bg-gray-100">
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
    </>
  );
};

export default ProjectSection;
