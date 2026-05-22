import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArticleFrontend } from "@/lib/data/types/articleTypes";
import {
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
  priority = false,
}: {
  article: BiographyPrototypeArticle;
  className: string;
  priority?: boolean;
}) {
  if (!article.imageUrl) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-[#e7e2d8] text-center font-archivo text-xs uppercase tracking-[0.16em] text-black/45`}
      >
        Biography image
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden bg-[#e7e2d8]`}>
      <Image
        src={article.imageUrl}
        alt={article.title}
        fill
        priority={priority}
        sizes={
          priority
            ? "(min-width: 1536px) 31vw, (min-width: 1024px) 32vw, 100vw"
            : "(min-width: 1536px) 15vw, (min-width: 1280px) 18vw, (min-width: 640px) 42vw, 100vw"
        }
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
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
      className="group flex min-h-full flex-col border border-black/10 bg-[#f1eee8] p-4 transition hover:border-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black xl:p-5 2xl:p-6"
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
          className="h-3 w-3 rounded-full border border-black"
          aria-hidden="true"
        />
      </div>
      <Link
        href={getArticleHref(article)}
        className="group flex min-h-full flex-col border border-black/10 bg-[#f7f5f1] transition hover:border-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
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
      className="w-full border-t border-black/10 bg-[#f7f5f1] text-black"
      data-testid="prototype-biography-section"
    >
      <div
        className={`${prototypeSectionFrameClassName} flex min-h-[720px] flex-col py-16 lg:py-24 2xl:py-28`}
      >
        <div className="mb-12 sm:mb-16 2xl:mb-20">
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
          <div className="grid gap-8 lg:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.22fr)] xl:grid-cols-[minmax(340px,0.72fr)_minmax(0,1.28fr)] xl:gap-10 2xl:grid-cols-[minmax(380px,560px)_minmax(0,1fr)] 2xl:gap-14">
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
        ) : (
          <BiographyPrototypeEmptyState />
        )}

        <div className="relative mt-14 flex justify-center sm:mt-16 2xl:mt-20">
          <div
            className="absolute left-0 right-0 top-1/2 z-0 border-t border-black/20"
            data-testid="prototype-biography-read-more-divider"
            aria-hidden="true"
          />
          <Link
            href="/biography"
            className="relative z-10 inline-flex min-h-16 w-full max-w-[330px] items-center justify-center gap-12 border border-black bg-[#f7f5f1] px-8 py-4 font-archivo text-base text-black transition hover:bg-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-black sm:text-lg 2xl:max-w-[360px]"
          >
            <span>Read more</span>
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
