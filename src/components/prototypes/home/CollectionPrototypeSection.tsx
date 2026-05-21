import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CollectionFrontend } from "@/lib/data/types/collectionTypes";
import { buildUrl } from "@/lib/utils/urlUtils";
import { prototypeSectionFrameClassName } from "./prototypeHomeLayout";

type CollectionPrototypeSectionProps = {
  collections: CollectionFrontend[];
};

const MAX_VISIBLE_COLLECTIONS = 6;

const sectionHeadingId = "prototype-collections-heading";

const formatIndex = (index: number) => String(index + 1).padStart(2, "0");

const getCollectionHref = (collection: CollectionFrontend) =>
  buildUrl([
    "collections",
    collection.slug,
    collection.firstArtworkId ?? "",
  ]);

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

function ExpandedCollectionPanel({
  collection,
}: {
  collection: CollectionFrontend;
}) {
  return (
    <Link
      href={getCollectionHref(collection)}
      className="group relative flex min-h-[520px] overflow-hidden border border-[#d7cdbd] bg-[#ddd6ca] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a713d] lg:min-h-[690px] lg:flex-[3.7] 2xl:min-h-[780px]"
      data-testid="prototype-collection-featured-card"
    >
      <CollectionImage collection={collection} priority />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/10"
        aria-hidden="true"
      />
      <div className="absolute left-5 top-6 font-archivo text-lg text-white/80 sm:left-8 2xl:left-9">
        {formatIndex(0)}
      </div>
      <div className="absolute right-5 top-6 hidden items-center gap-3 font-archivo text-sm uppercase text-white md:inline-flex 2xl:right-8">
        View collection
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80">
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </span>
      </div>
      <div className="absolute bottom-7 left-5 right-5 flex flex-col gap-4 sm:left-8 sm:right-8 2xl:bottom-9 2xl:left-9">
        <h3 className="break-words font-cormorant text-4xl font-semibold leading-none text-white sm:text-5xl xl:text-[56px]">
          {collection.title}
        </h3>
        <span className="inline-flex w-fit items-center gap-5 border-b border-white pb-2 font-archivo text-sm uppercase text-white">
          Explore this room
          <ArrowRight aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
}

function NarrowCollectionPanel({
  collection,
  index,
}: {
  collection: CollectionFrontend;
  index: number;
}) {
  return (
    <Link
      href={getCollectionHref(collection)}
      className="group relative flex min-h-[360px] overflow-hidden border border-[#d7cdbd] bg-[#ddd6ca] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a713d] sm:min-h-[420px] lg:min-h-[690px] lg:flex-[0.92] lg:basis-0 2xl:min-h-[780px]"
      data-testid="prototype-collection-card"
    >
      <CollectionImage collection={collection} />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/5"
        aria-hidden="true"
      />
      <div className="absolute left-5 top-6 font-archivo text-base text-white/80 lg:text-lg">
        {formatIndex(index)}
      </div>
      <div className="absolute bottom-6 left-5 right-5 lg:hidden">
        <h3 className="break-words font-cormorant text-3xl font-semibold leading-none text-white">
          {collection.title}
        </h3>
      </div>
      <div className="absolute bottom-8 left-1/2 hidden max-h-[78%] -translate-x-1/2 rotate-180 items-center [writing-mode:vertical-rl] lg:flex">
        <h3 className="break-words font-cormorant text-3xl font-semibold leading-none text-white 2xl:text-4xl">
          {collection.title}
        </h3>
      </div>
    </Link>
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
  const [featuredCollection, ...supportingCollections] = visibleCollections;
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
          <p className="font-archivo text-sm uppercase text-[#9a713d]">
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
            className="max-w-[460px] break-words font-cormorant text-6xl font-semibold leading-none text-slate sm:text-7xl lg:text-[82px] xl:text-[88px] 2xl:text-[98px]"
          >
            Explore the Collections
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

        {hasCollections && featuredCollection ? (
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-2 2xl:gap-3">
            <ExpandedCollectionPanel collection={featuredCollection} />
            {supportingCollections.map((collection, index) => (
              <NarrowCollectionPanel
                key={collection.slug || `${collection.title}-${index}`}
                collection={collection}
                index={index + 1}
              />
            ))}
          </div>
        ) : (
          <CollectionPrototypeEmptyState />
        )}
      </div>
    </section>
  );
}
