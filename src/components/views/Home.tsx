import React, { Suspense, type CSSProperties } from "react";

// ! COMPONENTS
import { Hero } from "../modules/hero/Hero";
import { prototypeHomeTypographyCss } from "@/components/prototypes/home/prototypeHomeLayout";

// ! LOADERS
import { BiographySectionLoader } from "../loaders/sectionLoaders/BiographySectionLoader";
import { BlogSectionLoader } from "../loaders/sectionLoaders/BlogSectionLoader";
import { CollectionsSectionLoader } from "@/components/loaders/sectionLoaders/CollectionSectionLoader";
import { SubscribeSectionLoader } from "@/components/loaders/sectionLoaders/SubscribeSectionLoader";
import { ProjectSectionLoader } from "@/components/loaders/sectionLoaders/ProjectSectionLoader";
import { ShopSectionLoader } from "@/components/loaders/sectionLoaders/ShopSectionLoader";

// ! SKELETONS
import { SubscribeSectionSkeleton } from "../sections/SubscribeSection";
//  GET /api/auth/session 200 in 8242ms

type HomeSectionShellStyle = CSSProperties & {
  "--prototype-home-frame-max": string;
  "--prototype-home-heading-scale": string;
  "--prototype-home-alt-bg": string;
};

const homeSectionShellStyle: HomeSectionShellStyle = {
  "--prototype-home-frame-max": "1920px",
  "--prototype-home-heading-scale": "0.9",
  "--prototype-home-alt-bg": "#f5f5f5",
};

function HomeSectionLoadingFallback({ testId }: { testId: string }) {
  return (
    <section
      className="prototype-home-primary-bg w-full border-t border-slate/10 py-16"
      data-testid={testId}
    />
  );
}

export async function Home() {
  return (
    <div data-testid="home-container">
      <Hero />

      <div
        className="prototype-home-shell prototype-home-primary-bg w-full text-slate"
        data-testid="home-redesign-sections"
        style={homeSectionShellStyle}
      >
        <style>{prototypeHomeTypographyCss}</style>

        <Suspense
          fallback={
            <HomeSectionLoadingFallback testId="collection-section-skeleton" />
          }
        >
          <CollectionsSectionLoader />
        </Suspense>

        <Suspense
          fallback={
            <HomeSectionLoadingFallback testId="biography-section-skeleton" />
          }
        >
          <BiographySectionLoader />
        </Suspense>

        <Suspense
          fallback={
            <SubscribeSectionSkeleton data-testid="subscribe-section-skeleton" />
          }
        >
          <SubscribeSectionLoader />
        </Suspense>

        <Suspense
          fallback={
            <HomeSectionLoadingFallback testId="blog-section-skeleton" />
          }
        >
          <BlogSectionLoader />
        </Suspense>

        <Suspense
          fallback={
            <HomeSectionLoadingFallback testId="project-section-skeleton" />
          }
        >
          <ProjectSectionLoader />
        </Suspense>

        <Suspense
          fallback={
            <HomeSectionLoadingFallback testId="shop-section-skeleton" />
          }
        >
          <ShopSectionLoader />
        </Suspense>
      </div>
    </div>
  );
}
