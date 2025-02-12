"use server";

import React, { Suspense } from "react";

// ! COMPONENTS
import { Hero } from "../../ui/hero/Hero";
import { ContentLayout } from "../../layouts/ContentLayout";

// ! SKELETONS
import { HomeProjectSectionSkeleton } from "../../skeletons/HomeProjectSectionSkeleton";
import { HomeBiographySectionSkeleton } from "../../skeletons/HomeBiographySectionSkeleton";
import { HomeSubscribeSectionSkeleton } from "@/components/skeletons/HomeSubscribeSkeleton";
import { HomeArtworkSectionSkeleton } from "@/components/skeletons/HomeArtworkSectionSkeleton";
import { BlogEntriesSkeleton } from "../../skeletons/BlogEntriesSkeleton";

// ! LOADERS
import { HomeBiographySectionLoader } from "../../loaders/homeBiographySectionLoader/HomeBiographySectionLoader";
import { HomeSubscribeSectionLoader } from "@/components/loaders/homeSubscribeSectionLoader/HomeSubscribeSectionLoader";
import { HomeProjectSectionLoader } from "@/components/loaders/homeProjectSectionLoader/homeProjectSectionLoader";
import { HomeArtworkSectionLoader } from "@/components/loaders/homeArtworkSectionLoader/HomeArtworkSectionLoader";
import { HomeBlogSectionLoader } from "@/components/loaders/homeBlogSectionLoader/HomeBlogSectionLoader";
import { HomeCollectionsSectionLoader } from "@/components/loaders/homeCollectionSectionLoader/HomeCollectionSectionLoader";

export async function Home() {
  return (
    <div data-testid="home-container">
      <Hero data-testid="home-hero" />

      <ContentLayout data-testid="home-content-layout">
        <Suspense fallback={<HomeArtworkSectionSkeleton />}>
          <HomeArtworkSectionLoader data-testid="home-artwork-section" />
        </Suspense>
      </ContentLayout>

      <ContentLayout data-testid="home-content-layout">
        <Suspense fallback={<HomeArtworkSectionSkeleton />}>
          <HomeCollectionsSectionLoader data-testid="home-collection-section" />
        </Suspense>
      </ContentLayout>

      <ContentLayout bg="bg-slate/5">
        <Suspense fallback={<HomeProjectSectionSkeleton />}>
          <HomeProjectSectionLoader data-testid="home-project-section" />
        </Suspense>
      </ContentLayout>

      <ContentLayout>
        <Suspense fallback={<HomeBiographySectionSkeleton />}>
          <HomeBiographySectionLoader data-testid="home-biography-section" />
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

// https://blog.arcjet.com/testing-next-js-app-router-api-routes/

// TODO: HomeCollectionSectionLoader
