"use server";

import React, { Suspense } from "react";
import Hero from "../ui/hero/Hero";
import ContentLayout from "../layouts/ContentLayout";
import HomeArtworkSectionSkeleton from "../skeletons/HomeArtworkSectionSkeleton";
import HomeArtworkSection from "../homepageSections/HomeArtworkSection";
import HomeProjectSectionSkeleton from "../skeletons/HomeProjectSectionSkeleton";
import { HomeProjectSection } from "../homepageSections/HomeProjectSection";
import HomeBiographySectionSkeleton from "../skeletons/HomeBiographySectionSkeleton";
import HomeBiographySection from "../homepageSections/HomeBiographySection";
import HomeSubscribeSection from "../homepageSections/HomeSubscribeSection";

// https://blog.arcjet.com/testing-next-js-app-router-api-routes/

export default async function HomepageView() {
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
