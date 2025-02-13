"use server";

import React, { Suspense } from "react";

// ! COMPONENTS
import { Hero } from "../ui/hero/Hero";
import { ContentLayout } from "../layouts/public/ContentLayout";

// ! SKELETONS
import { HomeProjectSectionSkeleton } from "../skeletons/HomeProjectSectionSkeleton";
import { HomeSubscribeSectionSkeleton } from "@/components/skeletons/HomeSubscribeSkeleton";
import { BlogSectionSkeleton } from "../sections/BlogSection";
import { CollectionSectionSkeleton } from "../sections/CollectionSection";
import { BiographySectionSkeleton } from "@/components/sections/BiographySection";

// ! LOADERS
import { BiographySectionLoader } from "../loaders/BiographySectionLoader";
import { BlogSectionLoader } from "../loaders/BlogSectionLoader";
import { CollectionsSectionLoader } from "@/components/loaders/CollectionSectionLoader";

import { HomeSubscribeSectionLoader } from "@/components/loaders/HomeSubscribeSectionLoader";
import { HomeProjectSectionLoader } from "@/components/loaders/homeProjectSectionLoader";

export async function Home() {
  return (
    <div data-testid="home-container">
      <Hero data-testid="home-hero" />

      <ContentLayout data-testid="home-content-layout">
        <Suspense fallback={<CollectionSectionSkeleton />}>
          <CollectionsSectionLoader data-testid="home-collection-section" />
        </Suspense>
      </ContentLayout>

      <ContentLayout bg="bg-slate/5">
        <Suspense fallback={<HomeProjectSectionSkeleton />}>
          <HomeProjectSectionLoader data-testid="home-project-section" />
        </Suspense>
      </ContentLayout>

      <ContentLayout>
        <Suspense fallback={<BiographySectionSkeleton />}>
          <BiographySectionLoader data-testid="home-biography-section" />
        </Suspense>
      </ContentLayout>

      <ContentLayout bg="bg-slate/5">
        <Suspense fallback={<HomeSubscribeSectionSkeleton />}>
          <HomeSubscribeSectionLoader data-testid="home-subscribe-section" />
        </Suspense>
      </ContentLayout>

      <ContentLayout bg="">
        <Suspense fallback={<BlogSectionSkeleton />}>
          <BlogSectionLoader data-testid="home-blog-section" />
        </Suspense>
      </ContentLayout>
    </div>
  );
}
