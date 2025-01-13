import Hero from "@/components/ui/hero/Hero";
import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import { fetchArticles } from "../lib/server/article/data-fetching/fetchArticles";
import SubscribeForm from "@/components/ui/forms/SubscribeForm";
import ContentLayout from "@/components/layouts/ContentLayout";
import { delay } from "@/utils/debug";
import HomeArtworkSection from "@/components/homepageSections/HomeArtworkSection";
import HomeBiographySection from "@/components/homepageSections/HomeBiographySection";
import HomeProjectSection from "@/components/homepageSections/HomeProjectSection";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import HomeBiographySectionSkeleton from "@/components/skeletons/HomeBiographySectionSkeleton";
import HomeArtworkSectionSkeleton from "@/components/skeletons/HomeArtworkSectionSkeleton";

type BiographyFields = Pick<
  IFrontendArticle,
  "title" | "subtitle" | "imageUrl" | "slug"
>;

export default async function Home() {
  return (
    <>
      {/* <Hero /> */}
      <ContentLayout>
        <div className="">
          <Suspense fallback={<HomeArtworkSectionSkeleton />}>
            <HomeArtworkSection />
          </Suspense>
        </div>

        {/* <div className="p-4 w-full">
          <HomeProjectSection />
        </div> */}
        {/* DONE HomeBiographySection */}
        {/* <div className="w-full flex flex-col items-center justify-center">
          <Suspense fallback={<HomeBiographySectionSkeleton />}>
            <HomeBiographySection />
          </Suspense>
        </div> */}
        {/* <div className="border border-black grid grid-cols-12 gap-4 bg-slate/5">
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
        </div> */}
      </ContentLayout>
    </>
  );
}

// <div className="flex space-x-4">
//   <Skeleton className="h-[300px] w-[250px]" />
//   <Skeleton className="h-[300px] w-[250px]" />
//   <Skeleton className="h-[300px] w-[250px]" />
//   <Skeleton className="h-[300px] w-[250px]" />
//   <Skeleton className="h-[300px] w-[250px]" />
// </div>

// https://blog.arcjet.com/testing-next-js-app-router-api-routes/

// await delay(2000);
// const biographyEntriesResponse = await fetchArticles<BiographyFields>(
//   "section",
//   "biography",
//   ["title", "subtitle", "slug", "imageUrl"]
// );

// console.log("biographyEntriesResponse", biographyEntriesResponse);

{
  /* {biographyEntriesResponse.success ? (
            <HomeBiographySection
              biographyEntries={biographyEntriesResponse.data}
            />
          ) : (
            <p>Error: {biographyEntriesResponse.message}</p>
          )} */
}
