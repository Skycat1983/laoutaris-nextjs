import React from "react";

type Props = {
  children: React.ReactNode;
};

const ContentLayout = ({ children }: Props) => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 py-32">
        <div className="col-span-1 lg:col-span-2"></div>

        <div className="col-span-10 lg:col-span-8 flex flex-col gap-24 ">
          {children}
        </div>
        <div className="col-span-1 lg:col-span-2"></div>
      </div>
    </>
  );
};

export default ContentLayout;

{
  /* <div className="">
            <ArtworkSection />
          </div>
          <div className="p-4 w-full">
            <ProjectSection />
          </div>

          <div className="w-full flex flex-col items-center justify-center">
            {biographyEntriesResponse.success ? (
              <BiographySection
                biographyEntries={biographyEntriesResponse.data}
              />
            ) : (
              <p>Error: {biographyEntriesResponse.message}</p>
            )}
          </div>
          <div className="border border-black grid grid-cols-12 gap-4 bg-slate/5">
            <div className="col-start-1 col-end-6 flex flex-col items-center justify-center gap-8">
              <div>
                <h1 className="text-4xl font-cormorant">Stay up to date</h1>
              </div>
              <div>
                <h1>Subscribe to our newsletter</h1>
              </div>
            </div>

            <div className="bg-slate-100 border col-start-7 col-end-12">
              <SubscribeForm />
            </div>
          </div> */
}
