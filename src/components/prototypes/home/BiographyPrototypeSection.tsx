import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArticleFrontend } from "@/lib/data/types/articleTypes";

type BiographyPrototypeArticle = Pick<
  ArticleFrontend,
  "imageUrl" | "slug" | "subtitle" | "title"
>;

type BiographyPrototypeSectionProps = {
  articles: BiographyPrototypeArticle[];
};

const MAX_ARTICLES = 5;

const formatIndex = (index: number) => String(index + 1).padStart(2, "0");

const getArticleHref = (article: BiographyPrototypeArticle) =>
  article.slug ? `/biography/${article.slug}` : "/biography";

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
            ? "(min-width: 1024px) 30vw, 100vw"
            : "(min-width: 1280px) 18vw, (min-width: 640px) 42vw, 100vw"
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
      className="group flex min-h-full flex-col border border-black/10 bg-[#f1eee8] p-4 transition hover:border-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
      data-testid="prototype-biography-featured-card"
    >
      <BiographyPrototypeImage
        article={article}
        className="aspect-[4/5] w-full"
        priority
      />
      <div className="flex flex-1 flex-col justify-end gap-3 px-1 pb-2 pt-7">
        <div className="flex items-center gap-3 font-archivo text-sm text-black/80">
          <span>{formatIndex(0)}</span>
          <span className="h-px w-8 bg-black/40" aria-hidden="true" />
        </div>
        <h3 className="font-cormorant text-4xl font-normal leading-none text-black sm:text-5xl">
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
    <article className="relative flex min-h-full flex-col pt-10">
      <div className="absolute left-1/2 top-0 hidden -translate-x-1/2 flex-col items-center gap-4 lg:flex">
        <span className="font-archivo text-lg leading-none text-black/90">
          {formatIndex(index)}
        </span>
        <span
          className="h-3 w-3 rounded-full border border-black bg-[#f7f5f1]"
          aria-hidden="true"
        />
      </div>
      <Link
        href={getArticleHref(article)}
        className="group flex min-h-full flex-col border border-black/10 bg-[#f7f5f1] transition hover:border-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
        data-testid="prototype-biography-card"
      >
        <BiographyPrototypeImage article={article} className="aspect-[4/5]" />
        <div className="flex min-h-[220px] flex-1 flex-col gap-4 px-4 py-6 sm:px-5">
          <span className="font-archivo text-sm text-black/65 lg:hidden">
            {formatIndex(index)}
          </span>
          <h3 className="font-cormorant text-3xl font-normal leading-none text-black sm:text-4xl">
            {article.title}
          </h3>
          <p className="font-archivo text-base leading-6 text-black/55">
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
  const visibleArticles = articles.slice(0, MAX_ARTICLES);
  const [featuredArticle, ...timelineArticles] = visibleArticles;
  const hasArticles = visibleArticles.length > 0;

  return (
    <section
      id="biography"
      aria-labelledby="prototype-biography-heading"
      className="w-full border-t border-black/10 bg-[#f7f5f1] text-black"
      data-testid="prototype-biography-section"
    >
      <div className="mx-auto flex min-h-[720px] w-full max-w-[1536px] flex-col px-4 py-16 sm:px-8 lg:px-12 lg:py-20 xl:px-16">
        <div className="mb-12 sm:mb-16">
          <p className="font-archivo text-3xl font-semibold leading-none text-black sm:text-4xl lg:text-[42px]">
            Biography:
          </p>
          <h2
            id="prototype-biography-heading"
            className="mt-3 max-w-5xl font-cormorant text-5xl font-normal leading-none text-black sm:text-6xl lg:text-7xl xl:text-[82px]"
          >
            Read my grandfather&apos;s story
          </h2>
        </div>

        {hasArticles && featuredArticle ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(300px,430px)_1fr] xl:gap-10">
            <FeaturedBiographyCard article={featuredArticle} />

            {timelineArticles.length > 0 ? (
              <div className="relative lg:pt-4">
                <div
                  className="absolute left-0 right-0 top-[37px] hidden border-t border-black/20 lg:block"
                  aria-hidden="true"
                />
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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

        <div className="relative mt-14 flex justify-center border-t border-black/20 sm:mt-16">
          <Link
            href="/biography"
            className="-mt-px inline-flex min-h-16 w-full max-w-[330px] items-center justify-center gap-12 border border-black bg-[#f7f5f1] px-8 py-4 font-archivo text-base text-black transition hover:bg-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-black sm:text-lg"
          >
            <span>Read more</span>
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
