import Hero from "@/components/ui/hero/Hero";
import ContentLayout from "@/components/layouts/ContentLayout";
import HomeArtworkSection from "@/components/homepageSections/HomeArtworkSection";
import HomeBiographySection from "@/components/homepageSections/HomeBiographySection";
import { HomeProjectSection } from "@/components/homepageSections/HomeProjectSection";
import { Suspense } from "react";
import HomeBiographySectionSkeleton from "@/components/skeletons/HomeBiographySectionSkeleton";
import HomeArtworkSectionSkeleton from "@/components/skeletons/HomeArtworkSectionSkeleton";
import HomeProjectSectionSkeleton from "@/components/skeletons/HomeProjectSectionSkeleton";
import HomeSubscribeSection from "@/components/homepageSections/HomeSubscribeSection";
import { Spinner } from "@/components/atoms/Spinner";

// https://blog.arcjet.com/testing-next-js-app-router-api-routes/

export default async function Home() {
  return (
    <>
      <Hero />
      <ContentLayout>
        <Suspense fallback={<HomeArtworkSectionSkeleton />}>
          <HomeArtworkSection />
        </Suspense>
        <Suspense fallback={<HomeProjectSectionSkeleton />}>
          <HomeProjectSection />
        </Suspense>
        <Suspense fallback={<HomeBiographySectionSkeleton />}>
          <HomeBiographySection />
        </Suspense>
        <HomeSubscribeSection />
      </ContentLayout>
    </>
  );
}
