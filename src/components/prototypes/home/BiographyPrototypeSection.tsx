"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { ArticleFrontend } from "@/lib/data/types/articleTypes";
import {
  prototypeImageSkeletonClassName,
  prototypeHeadingStyle,
  prototypeSectionEyebrowClassName,
  prototypeSectionFrameClassName,
} from "./prototypeHomeLayout";

type BiographyPrototypeArticle = Pick<
  ArticleFrontend,
  "imageUrl" | "slug" | "subtitle" | "title"
>;

type BiographyPrototypeSectionProps = {
  articles: BiographyPrototypeArticle[];
};

const MAX_ARTICLES = 5;
const BIOGRAPHY_ARTICLE_ORDER = [
  "early-years",
  "meeting-beryl",
  "ethos",
  "later-years",
  "obituary",
] as const;
const BIOGRAPHY_ARTICLE_ORDER_INDEX: ReadonlyMap<string, number> = new Map(
  BIOGRAPHY_ARTICLE_ORDER.map((slug, index) => [slug, index])
);

const formatIndex = (index: number) => String(index + 1).padStart(2, "0");

const getArticleHref = (article: BiographyPrototypeArticle) =>
  article.slug ? `/biography/${article.slug}` : "/biography";

const getArticleOrderKey = (article: BiographyPrototypeArticle) => {
  const slugKey = article.slug?.trim().toLowerCase();
  if (slugKey && BIOGRAPHY_ARTICLE_ORDER_INDEX.has(slugKey)) {
    return (
      BIOGRAPHY_ARTICLE_ORDER_INDEX.get(slugKey) ?? Number.MAX_SAFE_INTEGER
    );
  }

  const titleKey = article.title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    BIOGRAPHY_ARTICLE_ORDER_INDEX.get(titleKey) ?? Number.MAX_SAFE_INTEGER
  );
};

const getOrderedBiographyArticles = (articles: BiographyPrototypeArticle[]) =>
  articles
    .map((article, index) => ({ article, index }))
    .sort((left, right) => {
      const orderDelta =
        getArticleOrderKey(left.article) - getArticleOrderKey(right.article);

      return orderDelta || left.index - right.index;
    })
    .slice(0, MAX_ARTICLES)
    .map(({ article }) => article);

const sectionHeadingStyle = prototypeHeadingStyle({
  base: "2.75rem",
  sm: "3.5rem",
  lg: "4.5rem",
});

function BiographyPrototypeImage({
  article,
  className,
  imageClassName = "object-cover",
  priority = false,
  loading = "lazy",
}: {
  article: BiographyPrototypeArticle;
  className: string;
  imageClassName?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
}) {
  if (!article.imageUrl) {
    return (
      <div
        className={`${className} ${prototypeImageSkeletonClassName} flex items-center justify-center text-center font-archivo text-xs uppercase tracking-[0.16em] text-black/45`}
      >
        Biography image
      </div>
    );
  }

  return (
    <div
      className={`${className} ${prototypeImageSkeletonClassName} relative overflow-hidden`}
    >
      <Image
        src={article.imageUrl}
        alt={article.title}
        fill
        priority={priority}
        loading={priority ? undefined : loading}
        sizes={
          priority
            ? "(min-width: 1536px) 31vw, (min-width: 1024px) 32vw, 100vw"
            : "(min-width: 1536px) 15vw, (min-width: 1280px) 18vw, (min-width: 640px) 42vw, 100vw"
        }
        className={`z-10 ${imageClassName} transition duration-500 group-hover:scale-[1.03]`}
      />
    </div>
  );
}

function FeaturedBiographyCard({
  article,
}: {
  article: BiographyPrototypeArticle;
}) {
  return (
    <Link
      href={getArticleHref(article)}
      className="group flex min-h-full flex-col border border-black/10 bg-white/35 p-4 transition hover:border-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black xl:p-5 2xl:p-6"
      data-testid="prototype-biography-featured-card"
    >
      <BiographyPrototypeImage
        article={article}
        className="aspect-[4/5] w-full 2xl:aspect-[5/6]"
        priority
      />
      <div className="flex flex-1 flex-col justify-end gap-3 px-1 pb-2 pt-7 xl:px-2 xl:pt-9">
        <div className="flex items-center gap-3 font-archivo text-sm text-black/80">
          <span>{formatIndex(0)}</span>
          <span className="h-px w-8 bg-black/40" aria-hidden="true" />
        </div>
        <h3 className="font-cormorant text-4xl font-normal leading-none text-black sm:text-5xl 2xl:text-[60px]">
          {article.title}
        </h3>
        <p className="font-archivo text-base leading-6 text-black/55 sm:text-lg">
          {article.subtitle}
        </p>
      </div>
    </Link>
  );
}

function MobileBiographyPrototype({
  articles,
}: {
  articles: BiographyPrototypeArticle[];
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeIndex = Math.min(selectedIndex, articles.length - 1);
  const activeArticle = articles[activeIndex];

  if (!activeArticle) {
    return null;
  }

  return (
    <div className="lg:hidden" data-testid="prototype-mobile-biography">
      <Link
        href={getArticleHref(activeArticle)}
        className="group block border border-black/10 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)] transition hover:border-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
        data-testid="prototype-mobile-biography-featured-card"
      >
        <div className="relative">
          <div className="absolute left-5 top-5 z-10 flex flex-col items-start gap-3 font-archivo text-lg leading-none text-black sm:left-7 sm:top-7">
            <span>{formatIndex(activeIndex)}</span>
            <span className="h-px w-9 bg-black" aria-hidden="true" />
          </div>
          <BiographyPrototypeImage
            article={activeArticle}
            className="aspect-[1.14] w-full"
            imageClassName="object-cover"
            priority
          />
        </div>
        <div className="relative min-h-[150px] px-6 py-6 pr-16 sm:px-8 sm:py-7 sm:pr-20">
          <div className="min-w-0">
            <h3 className="font-cormorant text-[2.75rem] font-normal leading-none text-black sm:text-6xl">
              {activeArticle.title}
            </h3>
            <p className="mt-5 font-archivo text-sm uppercase leading-6 tracking-[0.08em] text-black/55 sm:text-base">
              {activeArticle.subtitle}
            </p>
          </div>
          <ArrowRight
            className="absolute bottom-7 right-6 h-7 w-7 text-black sm:bottom-8 sm:right-8"
            aria-hidden="true"
          />
        </div>
      </Link>

      <div
        className="mt-8"
        aria-label="Biography story selector"
      >
        <div
          className="grid grid-cols-5 gap-3 sm:gap-4"
          data-testid="prototype-mobile-biography-thumbnail-grid"
        >
          {articles.map((article, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={article.slug || `${article.title}-${index}`}
                type="button"
                className="group min-w-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                aria-label={`Show ${article.title} biography story`}
                aria-current={isActive ? "true" : undefined}
                aria-pressed={isActive}
                onClick={() => setSelectedIndex(index)}
                data-testid="prototype-mobile-biography-thumbnail"
              >
                <BiographyPrototypeImage
                  article={article}
                  className={`aspect-[0.72] w-full border transition ${
                    isActive
                      ? "border-black shadow-[0_0_0_2px_#ffffff,0_0_0_4px_#111111]"
                      : "border-black/10 group-hover:border-black/45"
                  }`}
                  imageClassName="object-cover"
                  loading="eager"
                />
                <span className="mt-4 block font-archivo text-base leading-none text-black">
                  {formatIndex(index)}
                </span>
                <span className="mt-2 block break-words font-cormorant text-base leading-[1.05] text-black sm:text-xl">
                  {article.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="mt-7 flex items-center justify-center gap-7"
        aria-label="Biography story pagination"
      >
        {articles.map((article, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={article.slug || `${article.title}-dot-${index}`}
              type="button"
              className={`h-3 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 ${
                isActive ? "w-6 bg-black" : "w-3 bg-black/20 hover:bg-black/45"
              }`}
              aria-label={`Show ${article.title}`}
              aria-current={isActive ? "true" : undefined}
              aria-pressed={isActive}
              onClick={() => setSelectedIndex(index)}
              data-testid="prototype-mobile-biography-dot"
            />
          );
        })}
      </div>

      <Link
        href="/biography"
        className="mt-12 flex min-h-[72px] w-full items-center justify-center gap-10 border border-black/15 bg-white/25 px-6 py-5 font-archivo text-xl text-black transition hover:border-black hover:bg-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        <span>Read the full story</span>
        <ArrowRight className="h-6 w-6" aria-hidden="true" />
      </Link>
    </div>
  );
}

function BiographyTimelineCard({
  article,
  index,
}: {
  article: BiographyPrototypeArticle;
  index: number;
}) {
  return (
    <article className="relative flex min-h-full flex-col pt-10 2xl:pt-12">
      <div className="absolute -top-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-4 lg:flex 2xl:-top-4">
        <span className="font-archivo text-lg leading-none text-black/90">
          {formatIndex(index)}
        </span>
        <span
          className="prototype-home-primary-bg h-3 w-3 rounded-full border border-black"
          aria-hidden="true"
        />
      </div>
      <Link
        href={getArticleHref(article)}
        className="prototype-home-primary-bg group flex min-h-full flex-col border border-black/10 transition hover:border-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
        data-testid="prototype-biography-card"
      >
        <BiographyPrototypeImage
          article={article}
          className="aspect-[4/5] 2xl:aspect-[5/6]"
        />
        <div className="flex min-h-[220px] flex-1 flex-col gap-4 px-4 py-6 sm:px-5 2xl:min-h-[240px] 2xl:p-6">
          <span className="font-archivo text-sm text-black/65 lg:hidden">
            {formatIndex(index)}
          </span>
          <h3 className="font-cormorant text-3xl font-normal leading-none text-black sm:text-4xl 2xl:text-[42px]">
            {article.title}
          </h3>
          <p className="font-archivo text-base leading-6 text-black/55 2xl:max-w-[18rem]">
            {article.subtitle}
          </p>
          <ArrowRight
            className="mt-auto h-5 w-5 self-end text-black"
            aria-hidden="true"
          />
        </div>
      </Link>
    </article>
  );
}

function BiographyPrototypeEmptyState() {
  return (
    <div
      className="border border-black/15 bg-white/45 px-5 py-10 sm:px-8 lg:px-12"
      data-testid="prototype-biography-empty"
    >
      <p className="max-w-2xl font-cormorant text-3xl leading-tight text-black sm:text-4xl">
        Biography articles are unavailable.
      </p>
      <p className="mt-4 max-w-xl font-archivo text-base leading-7 text-black/55">
        Visit the biography archive for the current story pages.
      </p>
    </div>
  );
}

export function BiographyPrototypeSection({
  articles,
}: BiographyPrototypeSectionProps) {
  const visibleArticles = getOrderedBiographyArticles(articles);
  const [featuredArticle, ...timelineArticles] = visibleArticles;
  const hasArticles = visibleArticles.length > 0;

  return (
    <section
      id="biography"
      aria-labelledby="prototype-biography-heading"
      className="prototype-home-primary-bg w-full border-t border-black/10 text-black"
      data-testid="prototype-biography-section"
    >
      <div
        className={`${prototypeSectionFrameClassName} flex min-h-[720px] flex-col py-16 lg:py-24 2xl:py-28`}
      >
        <div className="mb-7 sm:mb-10 lg:mb-16 2xl:mb-20">
          <p className={prototypeSectionEyebrowClassName}>Biography</p>
          <h2
            id="prototype-biography-heading"
            className="prototype-home-section-heading mt-3 max-w-[1180px] font-cormorant text-4xl font-normal leading-tight text-black sm:text-5xl lg:text-6xl"
            style={sectionHeadingStyle}
          >
            Read my grandfather&apos;s story
          </h2>
        </div>

        {hasArticles && featuredArticle ? (
          <>
            <MobileBiographyPrototype articles={visibleArticles} />

            <div
              className="hidden gap-8 lg:grid lg:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.22fr)] xl:grid-cols-[minmax(340px,0.72fr)_minmax(0,1.28fr)] xl:gap-10 2xl:grid-cols-[minmax(380px,560px)_minmax(0,1fr)] 2xl:gap-14"
              data-testid="prototype-desktop-biography"
            >
              <FeaturedBiographyCard article={featuredArticle} />

              {timelineArticles.length > 0 ? (
                <div className="relative lg:pt-4 2xl:pt-5">
                  <div
                    className="absolute left-0 right-0 top-9 z-0 hidden border-t border-black/20 lg:block 2xl:top-11"
                    data-testid="prototype-biography-timeline-line"
                    aria-hidden="true"
                  />
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 2xl:gap-6">
                    {timelineArticles.map((article, index) => (
                      <BiographyTimelineCard
                        key={article.slug || `${article.title}-${index}`}
                        article={article}
                        index={index + 1}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <BiographyPrototypeEmptyState />
        )}

        {!hasArticles ? (
          <Link
            href="/biography"
            className="mt-10 flex min-h-[72px] w-full items-center justify-center gap-10 border border-black/15 bg-white/25 px-6 py-5 font-archivo text-xl text-black transition hover:border-black hover:bg-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-black lg:hidden"
          >
            <span>Read the full story</span>
            <ArrowRight className="h-6 w-6" aria-hidden="true" />
          </Link>
        ) : null}

        <div className="relative mt-14 hidden justify-center sm:mt-16 lg:flex 2xl:mt-20">
          <div
            className="absolute left-0 right-0 top-1/2 z-0 border-t border-black/20"
            data-testid="prototype-biography-read-more-divider"
            aria-hidden="true"
          />
          <Link
            href="/biography"
            className="prototype-home-primary-bg relative z-10 inline-flex min-h-16 w-full max-w-[330px] items-center justify-center gap-12 border border-black px-8 py-4 font-archivo text-base text-black transition hover:bg-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-black sm:text-lg 2xl:max-w-[360px]"
          >
            <span>Read more</span>
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
