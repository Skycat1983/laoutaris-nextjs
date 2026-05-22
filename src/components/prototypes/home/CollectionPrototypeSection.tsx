"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CollectionFrontend } from "@/lib/data/types/collectionTypes";
import { buildUrl } from "@/lib/utils/urlUtils";
import {
  prototypeHeadingStyle,
  prototypeSectionEyebrowClassName,
  prototypeSectionFrameClassName,
} from "./prototypeHomeLayout";

type CollectionPrototypeSectionProps = {
  collections: CollectionFrontend[];
};

const MAX_VISIBLE_COLLECTIONS = 6;
const OPEN_PANEL_FLEX = 3.7;
const CLOSED_PANEL_FLEX = 0.92;
const DEFAULT_EXPANDED_COPY_WIDTH = 560;
const EXPANDED_COPY_HORIZONTAL_INSET = 64;

const sectionHeadingId = "prototype-collections-heading";

const formatIndex = (index: number) => String(index + 1).padStart(2, "0");

const getCollectionHref = (collection: CollectionFrontend) =>
  buildUrl([
    "collections",
    collection.slug,
    collection.firstArtworkId ?? "",
  ]);

const sectionHeadingStyle = prototypeHeadingStyle({
  base: "2.75rem",
  sm: "3.5rem",
  lg: "4.5rem",
});

function CollectionImage({
  collection,
  priority = false,
}: {
  collection: CollectionFrontend;
  priority?: boolean;
}) {
  if (!collection.imageUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#ddd6ca] px-5 text-center font-archivo text-sm text-slate/50">
        Collection image
      </div>
    );
  }

  return (
    <Image
      src={collection.imageUrl}
      alt={collection.title}
      fill
      priority={priority}
      sizes={
        priority
          ? "(min-width: 1536px) 38vw, (min-width: 1024px) 34vw, 100vw"
          : "(min-width: 1536px) 11vw, (min-width: 1024px) 10vw, (min-width: 640px) 50vw, 100vw"
      }
      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
    />
  );
}

function CollectionAccordionPanel({
  collection,
  index,
  isActive,
  onSelect,
}: {
  collection: CollectionFrontend;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}) {
  const panelId = `prototype-collection-panel-${collection.slug || index}`;
  const collectionHref = getCollectionHref(collection);
  const panelSizeClass = isActive
    ? "min-h-[520px] lg:flex-[3.7] 2xl:min-h-[780px]"
    : "min-h-[210px] sm:min-h-[260px] lg:min-h-[690px] lg:flex-[0.92] 2xl:min-h-[780px]";
  const expandedCopyStateClass = isActive
    ? "translate-x-0 opacity-100 delay-200"
    : "translate-x-16 opacity-0";
  const collapsedCopyStateClass = isActive
    ? "-translate-x-12 opacity-0"
    : "translate-x-0 opacity-100 delay-200";

  return (
    <article
      className={`group relative flex overflow-hidden border border-[#d7cdbd] bg-[#ddd6ca] transition-[flex,min-height] duration-700 ease-out motion-reduce:transition-none lg:basis-0 ${panelSizeClass}`}
      data-state={isActive ? "open" : "closed"}
      data-testid={
        isActive
          ? "prototype-collection-featured-card"
          : "prototype-collection-card"
      }
    >
      <CollectionImage collection={collection} priority={isActive} />
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          isActive
            ? "bg-gradient-to-t from-black/65 via-black/10 to-black/10"
            : "bg-gradient-to-t from-black/70 via-black/15 to-black/5"
        }`}
        aria-hidden="true"
      />

      <button
        type="button"
        aria-expanded={isActive}
        aria-controls={panelId}
        aria-label={`Expand ${collection.title} collection panel`}
        onClick={onSelect}
        className="absolute inset-0 z-10 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-white"
      />

      <div className="pointer-events-none absolute left-5 top-6 z-20 font-archivo text-base text-white/80 sm:left-8 lg:text-lg 2xl:left-9">
        {formatIndex(index)}
      </div>

      <Link
        href={collectionHref}
        className={`absolute right-5 top-6 z-30 hidden items-center gap-3 font-archivo text-sm uppercase text-white transition-[opacity,color] duration-300 hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:inline-flex 2xl:right-8 ${
          isActive
            ? "pointer-events-auto opacity-100 delay-200"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isActive}
        tabIndex={isActive ? undefined : -1}
      >
        View collection
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80">
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </span>
      </Link>

      <div
        className={`pointer-events-none absolute bottom-6 left-5 right-5 z-20 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none lg:bottom-8 lg:left-1/2 lg:right-auto lg:max-h-[78%] ${collapsedCopyStateClass}`}
        data-testid="prototype-collection-collapsed-title"
        aria-hidden={isActive}
      >
        <div className="lg:-translate-x-1/2 lg:rotate-180 lg:[writing-mode:vertical-rl]">
          <h3 className="break-words font-cormorant text-3xl font-semibold leading-none text-white 2xl:text-4xl">
            {collection.title}
          </h3>
        </div>
      </div>

      <div
        id={panelId}
        className={`pointer-events-none absolute bottom-7 left-5 z-20 flex w-[var(--prototype-collection-expanded-copy-width)] max-w-[calc(100vw-2.5rem)] flex-col gap-4 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none sm:left-8 sm:max-w-[calc(100vw-4rem)] 2xl:bottom-9 2xl:left-9 ${expandedCopyStateClass}`}
        data-testid="prototype-collection-expanded-title"
        aria-hidden={!isActive}
      >
        <Link
          href={collectionHref}
          className={`w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
            isActive ? "pointer-events-auto" : "pointer-events-none"
          }`}
          tabIndex={isActive ? undefined : -1}
        >
          <h3 className="break-words font-cormorant text-4xl font-semibold leading-none text-white sm:text-5xl xl:text-[56px]">
            {collection.title}
          </h3>
          <span className="mt-4 inline-flex w-fit items-center gap-5 border-b border-white pb-2 font-archivo text-sm uppercase text-white transition-colors hover:text-white/80">
            Explore this room
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </span>
        </Link>
      </div>
    </article>
  );
}

type CollectionAccordionStyle = CSSProperties & {
  "--prototype-collection-expanded-copy-width": string;
};

function CollectionAccordion({
  collections,
}: {
  collections: CollectionFrontend[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedCopyWidth, setExpandedCopyWidth] = useState(
    DEFAULT_EXPANDED_COPY_WIDTH
  );
  const accordionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const accordion = accordionRef.current;
    if (!accordion) return undefined;

    const updateExpandedCopyWidth = () => {
      const panelCount = collections.length;
      const accordionWidth = accordion.getBoundingClientRect().width;
      if (!panelCount || accordionWidth <= 0) return;

      const styles = window.getComputedStyle(accordion);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
      const availableWidth = Math.max(
        0,
        accordionWidth - gap * Math.max(panelCount - 1, 0)
      );
      const openFlexTotal =
        OPEN_PANEL_FLEX + CLOSED_PANEL_FLEX * Math.max(panelCount - 1, 0);
      const openPanelWidth =
        panelCount > 1
          ? (availableWidth * OPEN_PANEL_FLEX) / openFlexTotal
          : availableWidth;
      const copyWidth = Math.max(
        220,
        Math.round(openPanelWidth - EXPANDED_COPY_HORIZONTAL_INSET)
      );

      setExpandedCopyWidth(copyWidth);
    };

    updateExpandedCopyWidth();

    if (typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(updateExpandedCopyWidth);
    observer.observe(accordion);

    return () => observer.disconnect();
  }, [collections.length]);

  const accordionStyle: CollectionAccordionStyle = {
    "--prototype-collection-expanded-copy-width": `${expandedCopyWidth}px`,
  };

  return (
    <div
      ref={accordionRef}
      className="flex flex-col gap-3 lg:flex-row lg:gap-2 2xl:gap-3"
      style={accordionStyle}
    >
      {collections.map((collection, index) => (
        <CollectionAccordionPanel
          key={collection.slug || `${collection.title}-${index}`}
          collection={collection}
          index={index}
          isActive={index === activeIndex}
          onSelect={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
}

function CollectionPrototypeEmptyState() {
  return (
    <div
      className="flex min-h-[420px] items-center justify-center border border-[#d7cdbd] bg-white/45 px-6 py-14 text-center"
      data-testid="prototype-collections-empty"
    >
      <div className="max-w-xl">
        <h3 className="font-cormorant text-4xl font-semibold leading-none text-slate sm:text-5xl">
          Collection rooms are unavailable.
        </h3>
        <p className="mt-5 font-archivo text-base leading-7 text-slate/65">
          Visit the collections archive for the current room list.
        </p>
      </div>
    </div>
  );
}

export function CollectionPrototypeSection({
  collections,
}: CollectionPrototypeSectionProps) {
  const visibleCollections = collections.slice(0, MAX_VISIBLE_COLLECTIONS);
  const hasCollections = visibleCollections.length > 0;

  return (
    <section
      id="collections"
      aria-labelledby={sectionHeadingId}
      className="w-full border-t border-[#d8c8ad] bg-[#f7f4ee] text-slate"
      data-testid="prototype-collections-section"
    >
      <div
        className={`${prototypeSectionFrameClassName} grid min-h-[760px] gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(280px,0.36fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:py-24 xl:grid-cols-[minmax(330px,0.34fr)_minmax(0,1fr)] 2xl:min-h-[900px] 2xl:gap-20 2xl:py-28`}
      >
        <div className="flex min-w-0 flex-col items-start lg:max-w-[440px]">
          <p className={prototypeSectionEyebrowClassName}>
            Private collection rooms
          </p>
          <div className="my-7 flex w-full max-w-[320px] items-center gap-3">
            <span className="h-px flex-1 bg-[#b9915a]" aria-hidden="true" />
            <span
              className="h-2.5 w-2.5 rotate-45 border border-[#b9915a]"
              aria-hidden="true"
            />
            <span className="h-px flex-1 bg-[#b9915a]" aria-hidden="true" />
          </div>
          <h2
            id={sectionHeadingId}
            className="prototype-home-section-heading max-w-[460px] break-words font-cormorant text-4xl font-semibold leading-tight text-slate sm:text-5xl lg:text-6xl"
            style={sectionHeadingStyle}
          >
            Explore the collections
          </h2>
          <p className="mt-8 max-w-[340px] break-words font-archivo text-base leading-7 text-slate/70 sm:text-lg">
            Discover curated groups of works, each offering a unique
            perspective into the artist&apos;s world.
          </p>
          <Link
            href="/collections"
            className="mt-14 inline-flex items-center gap-7 border-b border-[#9a713d] pb-3 font-archivo text-sm uppercase text-[#9a713d] transition-colors hover:text-slate focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a713d]"
          >
            Explore the collections
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>
        </div>

        {hasCollections ? (
          <CollectionAccordion collections={visibleCollections} />
        ) : (
          <CollectionPrototypeEmptyState />
        )}
      </div>
    </section>
  );
}
