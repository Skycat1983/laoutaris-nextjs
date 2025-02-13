"use server";

import React, { Suspense } from "react";

// ! COMPONENTS
import { Hero } from "../../ui/hero/Hero";
import { ContentLayout } from "../../layouts/public/ContentLayout";

// ! SKELETONS
import { HomeProjectSectionSkeleton } from "../../skeletons/HomeProjectSectionSkeleton";
import { HomeBiographySectionSkeleton } from "../../skeletons/HomeBiographySectionSkeleton";
import { HomeSubscribeSectionSkeleton } from "@/components/skeletons/HomeSubscribeSkeleton";
import { BlogEntriesSkeleton } from "../../skeletons/BlogEntriesSkeleton";

// ! LOADERS
import { BiographySectionLoader } from "../../loaders/homeBiographySectionLoader/BiographySectionLoader";
import { HomeSubscribeSectionLoader } from "@/components/loaders/homeSubscribeSectionLoader/HomeSubscribeSectionLoader";
import { HomeProjectSectionLoader } from "@/components/loaders/homeProjectSectionLoader/homeProjectSectionLoader";
import { HomeBlogSectionLoader } from "@/components/loaders/homeBlogSectionLoader/HomeBlogSectionLoader";
import { CollectionsSectionLoader } from "@/components/loaders/homeCollectionSectionLoader/CollectionSectionLoader";
import { HomeCollectionSectionSkeleton } from "@/components/skeletons/HomeCollectionSectionSkeleton";

export async function Home() {
  return (
    <div data-testid="home-container">
      <Hero data-testid="home-hero" />

      <ContentLayout data-testid="home-content-layout">
        <Suspense fallback={<HomeCollectionSectionSkeleton />}>
          <CollectionsSectionLoader data-testid="home-collection-section" />
        </Suspense>
      </ContentLayout>

      <ContentLayout bg="bg-slate/5">
        <Suspense fallback={<HomeProjectSectionSkeleton />}>
          <HomeProjectSectionLoader data-testid="home-project-section" />
        </Suspense>
      </ContentLayout>

      <ContentLayout>
        <Suspense fallback={<HomeBiographySectionSkeleton />}>
          <BiographySectionLoader data-testid="home-biography-section" />
        </Suspense>
      </ContentLayout>

      <ContentLayout bg="bg-slate/5">
        <Suspense fallback={<HomeSubscribeSectionSkeleton />}>
          <HomeSubscribeSectionLoader data-testid="home-subscribe-section" />
        </Suspense>
      </ContentLayout>

      <ContentLayout bg="">
        <Suspense fallback={<BlogEntriesSkeleton />}>
          <HomeBlogSectionLoader data-testid="home-blog-section" />
        </Suspense>
      </ContentLayout>
    </div>
  );
}
