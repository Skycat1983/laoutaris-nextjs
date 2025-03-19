"use server";

import React, { Suspense } from "react";

// ! COMPONENTS
import { Hero } from "../modules/hero/Hero";
import { ContentLayout } from "../layouts/public/ContentLayout";

// ! LOADERS
import { BiographySectionLoader } from "../loaders/sectionLoaders/BiographySectionLoader";
import { BlogSectionLoader } from "../loaders/sectionLoaders/BlogSectionLoader";
import { CollectionsSectionLoader } from "@/components/loaders/sectionLoaders/CollectionSectionLoader";
import { SubscribeSectionLoader } from "@/components/loaders/sectionLoaders/SubscribeSectionLoader";
import { ProjectSectionLoader } from "@/components/loaders/sectionLoaders/ProjectSectionLoader";

// ! SKELETONS
import { BlogSectionSkeleton } from "../sections/BlogSection";
import { CollectionSectionSkeleton } from "../sections/CollectionSection";
import { BiographySectionSkeleton } from "@/components/sections/BiographySection";
import { SubscribeSectionSkeleton } from "../sections/SubscribeSection";
import { ProjectSectionSkeleton } from "@/components/sections/ProjectSection";
//  GET /api/auth/session 200 in 8242ms

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
        <Suspense fallback={<ProjectSectionSkeleton />}>
          <ProjectSectionLoader data-testid="home-project-section" />
        </Suspense>
      </ContentLayout>

      <ContentLayout>
        <Suspense fallback={<BiographySectionSkeleton />}>
          <BiographySectionLoader data-testid="home-biography-section" />
        </Suspense>
      </ContentLayout>

      <ContentLayout bg="bg-slate/5">
        <Suspense fallback={<SubscribeSectionSkeleton />}>
          <SubscribeSectionLoader data-testid="home-subscribe-section" />
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
