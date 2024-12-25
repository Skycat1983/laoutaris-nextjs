import ArtworkSection from "@/components/homepageSections/ArtworkSection";
import BiographySection from "@/components/homepageSections/BiographySection";
import ProjectSection from "@/components/homepageSections/ProjectSection";
import Hero from "@/components/ui/hero/Hero";
import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import { fetchArticles } from "../lib/server/article/data-fetching/fetchArticles";
import { fetchTest } from "@/lib/server/article/data-fetching/fetchTest";
import { headers } from "next/headers";
import SubscribeForm from "@/components/ui/forms/SubscribeForm";
import SidebarLayout from "@/components/layouts/ContentLayout";
import ContentLayout from "@/components/layouts/ContentLayout";

type BiographyFields = Pick<
  IFrontendArticle,
  "title" | "subtitle" | "imageUrl" | "slug"
>;

// https://blog.arcjet.com/testing-next-js-app-router-api-routes/

export default async function Home() {
  const biographyEntriesResponse = await fetchArticles<BiographyFields>(
    "section",
    "biography",
    ["title", "subtitle", "slug", "imageUrl"]
  );

  console.log("biographyEntriesResponse", biographyEntriesResponse);

  return (
    <>
      <Hero />
      <ContentLayout>
        <div className="">
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
          <div className="col-start-1 col-end-6 flex flex-col items-center justify-center gap-8 text-center bg-slate/10">
            <div>
              <h1 className="text-4xl font-cormorant">Stay up to date</h1>
            </div>
            <div>
              <h1>Subscribe to our newsletter for discounts and updates.</h1>
            </div>
          </div>

          <div className="bg-slate-100 border col-start-7 col-end-12">
            <SubscribeForm />
          </div>
        </div>
      </ContentLayout>
    </>
  );
}

{
  /* <div className="grid grid-cols-12 gap-4 py-32">
        <div className="col-span-1 lg:col-span-2"></div>

        <div className="col-span-10 lg:col-span-8 flex flex-col gap-24 ">
          <div className="">
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
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2"></div>
      </div> */
}
