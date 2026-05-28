"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { CollectionFrontend } from "@/lib/data/types/collectionTypes";
import { buildUrl } from "@/lib/utils/urlUtils";
import {
  prototypeImageSkeletonClassName,
  prototypeHeadingStyle,
  prototypeSectionEyebrowClassName,
  prototypeSectionFrameClassName,
} from "./prototypeHomeLayout";

type CollectionPrototypeSectionProps = {
  collections: CollectionFrontend[];
  useAlternateBackground?: boolean;
};

type CollectionCarouselApi = UseEmblaCarouselType[1];

const MAX_VISIBLE_COLLECTIONS = 6;
const OPEN_PANEL_FLEX = 3.7;
const CLOSED_PANEL_FLEX = 0.92;
const DEFAULT_EXPANDED_COPY_WIDTH = 560;
const EXPANDED_COPY_HORIZONTAL_INSET = 64;

const sectionHeadingId = "prototype-collections-heading";

const formatIndex = (index: number) => String(index + 1).padStart(2, "0");

const getCollectionHref = (collection: CollectionFrontend) =>
  buildUrl(["collections", collection.slug, collection.firstArtworkId ?? ""]);

const sectionHeadingStyle = prototypeHeadingStyle({
  base: "4.05rem",
  sm: "4.45rem",
  lg: "4.5rem",
});

function CollectionImage({
  collection,
  priority = false,
  loading = "lazy",
}: {
  collection: CollectionFrontend;
  priority?: boolean;
  loading?: "eager" | "lazy";
}) {
  if (!collection.imageUrl) {
    return (
      <div
        className={`${prototypeImageSkeletonClassName} flex h-full w-full items-center justify-center px-5 text-center font-archivo text-sm text-slate/50`}
      >
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
      loading={priority ? undefined : loading}
      sizes={
        priority
          ? "(min-width: 1536px) 38vw, (min-width: 1024px) 34vw, 100vw"
          : "(min-width: 1536px) 11vw, (min-width: 1024px) 10vw, (min-width: 640px) 50vw, 100vw"
      }
      className="z-10 object-cover transition-transform duration-700 group-hover:scale-[1.03]"
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
      className={`group ${prototypeImageSkeletonClassName} relative flex overflow-hidden border border-neutral-300 transition-[flex,min-height] duration-700 ease-out motion-reduce:transition-none lg:basis-0 ${panelSizeClass}`}
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

function getMobileCardVisualClass(offset: number) {
  if (offset === 0) {
    return "left-1/2 top-5 z-40 h-[430px] w-[min(74vw,330px)] -translate-x-1/2 translate-y-0 scale-100 opacity-100 shadow-[0_24px_54px_rgba(0,0,0,0.22)]";
  }

  if (offset === -1) {
    return "left-[4.5vw] top-[95px] z-20 h-[350px] w-[min(45vw,205px)] translate-x-0 translate-y-0 scale-100 opacity-95 shadow-[0_14px_30px_rgba(0,0,0,0.14)] sm:left-[18vw]";
  }

  if (offset === 1) {
    return "right-[4.5vw] top-[95px] z-20 h-[350px] w-[min(45vw,205px)] translate-x-0 translate-y-0 scale-100 opacity-95 shadow-[0_14px_30px_rgba(0,0,0,0.14)] sm:right-[18vw]";
  }

  if (offset === -2) {
    return "left-[-9vw] top-[118px] z-10 h-[315px] w-[min(36vw,165px)] translate-x-0 translate-y-0 scale-100 opacity-80";
  }

  if (offset === 2) {
    return "right-[-9vw] top-[118px] z-10 h-[315px] w-[min(36vw,165px)] translate-x-0 translate-y-0 scale-100 opacity-80";
  }

  return "pointer-events-none left-1/2 top-[118px] z-0 h-[315px] w-[min(36vw,165px)] -translate-x-1/2 translate-y-6 scale-95 opacity-0";
}

function getShortestCircularOffset(
  index: number,
  activeIndex: number,
  itemCount: number
) {
  if (itemCount <= 0) return 0;

  const rawOffset = index - activeIndex;
  const wrappedForward = rawOffset - itemCount;
  const wrappedBackward = rawOffset + itemCount;

  return [rawOffset, wrappedForward, wrappedBackward].reduce((best, offset) =>
    Math.abs(offset) < Math.abs(best) ? offset : best
  );
}

function getCollectionDeckCopy(collection: CollectionFrontend) {
  return collection.subtitle || collection.summary || "View collection room.";
}

function MobileCollectionDeck({
  collections,
}: {
  collections: CollectionFrontend[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: collections.length > 1,
    skipSnaps: false,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCollection = collections[activeIndex] ?? collections[0];
  const canNavigate = collections.length > 1;

  const syncSelectedSlide = useCallback((api: CollectionCarouselApi) => {
    if (!api) return;

    setActiveIndex(api.selectedScrollSnap());
  }, []);

  const selectPreviousCollection = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? collections.length - 1 : currentIndex - 1
    );
    emblaApi?.scrollPrev();
  };

  const selectNextCollection = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === collections.length - 1 ? 0 : currentIndex + 1
    );
    emblaApi?.scrollNext();
  };

  const selectCollection = (index: number) => {
    setActiveIndex(index);
    emblaApi?.scrollTo(index);
  };

  useEffect(() => {
    if (!emblaApi) return undefined;

    syncSelectedSlide(emblaApi);
    emblaApi.on("select", syncSelectedSlide);
    emblaApi.on("reInit", syncSelectedSlide);

    return () => {
      emblaApi.off("select", syncSelectedSlide);
      emblaApi.off("reInit", syncSelectedSlide);
    };
  }, [emblaApi, syncSelectedSlide]);

  return (
    <div
      className="lg:hidden"
      data-testid="prototype-mobile-collections"
      role="region"
      aria-label="Mobile collection carousel"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          selectPreviousCollection();
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          selectNextCollection();
        }
      }}
    >
      <div className="sr-only" aria-hidden="true">
        <div ref={emblaRef}>
          <div className="flex">
            {collections.map((collection, index) => (
              <div
                key={`embla-${collection.slug || collection.title}-${index}`}
                className="min-w-0 shrink-0 grow-0 basis-full"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-[calc(50%-50vw)] h-[470px] overflow-hidden sm:mt-2">
        <div className="absolute inset-0">
          {collections.map((collection, index) => {
            const offset = getShortestCircularOffset(
              index,
              activeIndex,
              collections.length
            );
            const isActive = index === activeIndex;
            const isVisiblyPeeking = Math.abs(offset) <= 2;
            const cardVisualClass = getMobileCardVisualClass(offset);

            return (
              <article
                key={collection.slug || `${collection.title}-${index}`}
                className={`group ${prototypeImageSkeletonClassName} absolute origin-center overflow-hidden rounded-[14px] border border-white/45 transition-[opacity,transform] duration-500 ease-out will-change-transform motion-reduce:transition-none ${cardVisualClass}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${collections.length}`}
                data-state={isActive ? "open" : "closed"}
                data-testid={
                  isActive
                    ? "prototype-mobile-collection-featured-card"
                    : "prototype-mobile-collection-card"
                }
                aria-hidden={!isVisiblyPeeking}
              >
                <CollectionImage
                  collection={collection}
                  priority={isActive}
                  loading={isVisiblyPeeking ? "eager" : "lazy"}
                />
                <div
                  className={`absolute inset-0 ${
                    isActive
                      ? "bg-gradient-to-t from-black/62 via-black/10 to-black/10"
                      : "bg-gradient-to-t from-black/66 via-black/20 to-black/5"
                  }`}
                  aria-hidden="true"
                />

                <button
                  type="button"
                  aria-pressed={isActive}
                  aria-label={`Select ${collection.title} mobile collection card`}
                  onClick={() => selectCollection(index)}
                  tabIndex={isVisiblyPeeking ? undefined : -1}
                  className="absolute inset-0 z-10 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-white"
                />

                <span className="pointer-events-none absolute left-5 top-5 z-20 font-archivo text-2xl text-white">
                  {formatIndex(index)}
                </span>

                <Link
                  href={getCollectionHref(collection)}
                  aria-label={`Open ${collection.title} collection`}
                  aria-hidden={!isActive}
                  tabIndex={isActive ? undefined : -1}
                  className={`absolute right-5 top-5 z-30 inline-flex items-center gap-3 font-archivo text-2xl uppercase text-white transition-[opacity,transform] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none ${
                    isActive
                      ? "translate-y-0 opacity-100 delay-150"
                      : "pointer-events-none -translate-y-2 opacity-0"
                  }`}
                >
                  View
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white">
                    <ArrowRight aria-hidden="true" className="h-6 w-6" />
                  </span>
                </Link>

                <div
                  className={`pointer-events-none absolute bottom-8 left-5 right-5 z-20 text-white transition-[opacity,transform] duration-300 motion-reduce:transition-none ${
                    isActive
                      ? "translate-y-0 opacity-100 delay-150"
                      : "translate-y-5 opacity-0"
                  }`}
                  aria-hidden={!isActive}
                >
                  <h3 className="break-words font-cormorant text-5xl font-semibold leading-none">
                    {collection.title}
                  </h3>
                  <p className="mt-4 max-w-[16rem] break-words font-archivo text-xl leading-8">
                    {getCollectionDeckCopy(collection)}
                  </p>
                </div>

                <div
                  className={`pointer-events-none absolute bottom-7 left-1/2 z-20 w-[260px] -translate-x-1/2 rotate-180 transition-[opacity,transform] duration-300 [writing-mode:vertical-rl] motion-reduce:transition-none ${
                    isActive ? "opacity-0" : "opacity-100 delay-150"
                  }`}
                  aria-hidden={isActive}
                >
                  <h3 className="break-words text-center font-cormorant text-3xl font-semibold leading-none text-white">
                    {collection.title}
                  </h3>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-1 flex items-center justify-center gap-5">
        <button
          type="button"
          aria-label="Show previous collection"
          onClick={selectPreviousCollection}
          disabled={!canNavigate}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white/65 text-neutral-900 transition-[opacity,transform,background-color] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
        >
          <ArrowLeft aria-hidden="true" className="h-5 w-5" />
        </button>

        <div className="flex justify-center gap-4">
          {collections.map((collection, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={collection.slug || `${collection.title}-dot-${index}`}
                type="button"
                aria-pressed={isActive}
                aria-label={`Show ${collection.title}`}
                onClick={() => selectCollection(index)}
                className={`h-4 w-4 rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate ${
                  isActive
                    ? "border-neutral-900 bg-neutral-900"
                    : "border-neutral-300 bg-neutral-300"
                }`}
              />
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Show next collection"
          onClick={selectNextCollection}
          disabled={!canNavigate}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white/65 text-neutral-900 transition-[opacity,transform,background-color] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
        >
          <ArrowRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      {activeCollection ? (
        <p className="sr-only" aria-live="polite">
          Showing {activeCollection.title}
        </p>
      ) : null}
    </div>
  );
}

function CollectionPrototypeEmptyState() {
  return (
    <div
      className="flex min-h-[420px] items-center justify-center border border-neutral-300 bg-white/45 px-6 py-14 text-center"
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
  useAlternateBackground = true,
}: CollectionPrototypeSectionProps) {
  const visibleCollections = collections.slice(0, MAX_VISIBLE_COLLECTIONS);
  const hasCollections = visibleCollections.length > 0;
  const backgroundClassName = useAlternateBackground
    ? "prototype-home-alt-bg"
    : "prototype-home-primary-bg";

  return (
    <section
      id="collections"
      aria-labelledby={sectionHeadingId}
      className={`${backgroundClassName} prototype-home-accent-divider-border w-full border-t text-slate`}
      data-testid="prototype-collections-section"
    >
      <div
        className={`${prototypeSectionFrameClassName} grid min-h-[760px] gap-7 overflow-hidden py-16 sm:gap-9 sm:py-20 lg:grid-cols-[minmax(280px,0.36fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:overflow-visible lg:py-24 xl:grid-cols-[minmax(330px,0.34fr)_minmax(0,1fr)] 2xl:min-h-[900px] 2xl:gap-20 2xl:py-28`}
      >
        <div className="flex min-w-0 flex-col items-start pt-3 sm:pt-6 lg:max-w-[440px] lg:pt-0">
          <p className={prototypeSectionEyebrowClassName}>
            Private collection rooms
          </p>
          <div className="my-7 flex w-full max-w-[320px] items-center gap-3">
            <span
              className="prototype-home-accent-divider h-px flex-1"
              aria-hidden="true"
            />
            <span
              className="prototype-home-accent-border h-2.5 w-2.5 rotate-45 border"
              aria-hidden="true"
            />
            <span
              className="prototype-home-accent-divider h-px flex-1"
              aria-hidden="true"
            />
          </div>
          <h2
            id={sectionHeadingId}
            className="prototype-home-section-heading max-w-[460px] break-words font-cormorant text-4xl font-semibold leading-tight text-slate sm:text-5xl lg:text-6xl"
            style={sectionHeadingStyle}
          >
            Explore the collections
          </h2>
          <p className="mt-8 max-w-[340px] break-words font-archivo text-base leading-7 text-slate/70 sm:text-lg lg:max-w-[340px]">
            Discover curated groups of works, each offering a unique perspective
            into the artist&apos;s world.
          </p>
          <Link
            href="/collections"
            className="prototype-home-accent-link mt-14 hidden items-center gap-7 border-b pb-3 font-archivo text-sm uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate lg:inline-flex"
          >
            Explore the collections
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>
        </div>

        {hasCollections ? (
          <>
            <MobileCollectionDeck collections={visibleCollections} />
            <div
              className="hidden lg:block"
              data-testid="prototype-desktop-collections"
            >
              <CollectionAccordion collections={visibleCollections} />
            </div>
          </>
        ) : (
          <CollectionPrototypeEmptyState />
        )}

        <Link
          href="/collections"
          className="prototype-home-accent-link flex w-full items-center justify-between border-b pb-3 font-archivo text-sm uppercase tracking-[0.14em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate lg:hidden"
        >
          Explore the collections
          <ArrowRight aria-hidden="true" className="h-7 w-7" />
        </Link>
      </div>
    </section>
  );
}
