import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogEntryFrontend } from "@/lib/data/types/blogTypes";
import { getCloudinaryDeliveryUrl } from "@/lib/images/cloudinaryDelivery";
import {
  prototypeHeadingStyle,
  prototypeSectionEyebrowClassName,
  prototypeSectionFrameClassName,
} from "./prototypeHomeLayout";

type BlogPrototypeSectionProps = {
  blogs: BlogEntryFrontend[];
  useAlternateBackground?: boolean;
};

const sectionHeadingId = "prototype-blog-heading";

const getBlogHref = (slug: string) => `/blog/${slug}`;

const getBlogSummary = (blog: BlogEntryFrontend) =>
  blog.subtitle?.trim() || blog.summary?.trim() || "";

const sectionHeadingStyle = prototypeHeadingStyle({
  base: "2.75rem",
  sm: "3.5rem",
  lg: "4.5rem",
});

const mobileArchiveLimit = 4;

type BlogDateInput =
  | BlogEntryFrontend["displayDate"]
  | string
  | number
  | null
  | undefined;

const blogDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const getBlogDisplayDate = (dateInput: BlogDateInput) => {
  if (!dateInput) {
    return null;
  }

  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    dateTime: date.toISOString(),
    label: blogDateFormatter.format(date).toUpperCase(),
  };
};

function BlogImage({
  blog,
  variant,
  className,
  sizes,
  priority = false,
}: {
  blog: BlogEntryFrontend;
  variant: "blogHero" | "blogGridCard";
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!blog.imageUrl) {
    return (
      <div
        aria-hidden="true"
        className="flex h-full w-full items-center justify-center bg-[#e5e2dc] font-cormorant text-4xl text-slate/30"
      >
        JL
      </div>
    );
  }

  return (
    <Image
      src={getCloudinaryDeliveryUrl(blog.imageUrl, variant)}
      alt={blog.title}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}

function MobileBlogArchiveRow({ blog }: { blog: BlogEntryFrontend }) {
  const summary = getBlogSummary(blog);
  const displayDate = getBlogDisplayDate(blog.displayDate);

  return (
    <li className="border-t border-slate/10">
      <Link
        href={getBlogHref(blog.slug)}
        className="group grid min-w-0 grid-cols-[88px_minmax(0,1fr)_1.5rem] items-center gap-4 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate sm:grid-cols-[132px_minmax(0,1fr)_minmax(92px,auto)_1.5rem] sm:gap-7 sm:py-7"
      >
        <div className="relative aspect-[1.55/1] w-full overflow-hidden bg-[#e5e2dc]">
          <BlogImage
            blog={blog}
            variant="blogGridCard"
            sizes="(min-width: 640px) 132px, 88px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <div className="min-w-0">
          <h3 className="break-words font-cormorant text-2xl font-semibold leading-[1.05] text-slate sm:text-[2rem]">
            {blog.title}
          </h3>
          {summary ? (
            <p className="mt-2 line-clamp-2 break-words font-archivo text-sm leading-6 text-slate/70">
              {summary}
            </p>
          ) : null}
          {displayDate ? (
            <time
              dateTime={displayDate.dateTime}
              className="mt-3 block font-archivo text-[0.68rem] uppercase tracking-[0.12em] text-slate/60 sm:hidden"
            >
              {displayDate.label}
            </time>
          ) : null}
        </div>
        {displayDate ? (
          <time
            dateTime={displayDate.dateTime}
            className="hidden justify-self-end whitespace-nowrap font-archivo text-[0.68rem] uppercase tracking-[0.12em] text-slate/60 sm:block"
          >
            {displayDate.label}
          </time>
        ) : (
          <span aria-hidden="true" className="hidden sm:block" />
        )}
        <ArrowRight
          aria-hidden="true"
          className="h-5 w-5 justify-self-end text-slate/70 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate"
          strokeWidth={1.5}
        />
      </Link>
    </li>
  );
}

function MobileBlogSection({
  leadBlog,
  archiveBlogs,
}: {
  leadBlog?: BlogEntryFrontend;
  archiveBlogs: BlogEntryFrontend[];
}) {
  const leadSummary = leadBlog ? getBlogSummary(leadBlog) : "";
  const leadDisplayDate = leadBlog
    ? getBlogDisplayDate(leadBlog.displayDate)
    : null;

  return (
    <div
      className={`${prototypeSectionFrameClassName} flex flex-col gap-9 py-14 md:hidden`}
      data-testid="prototype-mobile-blog"
    >
      <div className="flex min-w-0 flex-col gap-6">
        <p className="prototype-home-accent-text font-archivo text-xs uppercase tracking-[0.28em]">
          Journal
        </p>
        <h2 className="max-w-[12ch] break-words font-cormorant text-[3.35rem] font-semibold leading-[0.96] text-slate sm:max-w-none sm:text-[4rem]">
          Notes from the Studio
        </h2>
        <p className="max-w-[34rem] break-words font-archivo text-base leading-7 text-slate/70 sm:text-lg">
          Reflections, updates, and stories from the life and work of Joseph
          Laoutaris.
        </p>
      </div>

      <div className="prototype-home-accent-divider h-px w-full" />

      {leadBlog ? (
        <article
          className="flex min-w-0 flex-col gap-6"
          data-testid="prototype-mobile-blog-featured"
        >
          <p className="prototype-home-accent-text font-archivo text-xs uppercase tracking-[0.28em]">
            Featured memorial story
          </p>
          <div className="grid min-w-0 gap-7 sm:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] sm:items-center">
            <div className="relative aspect-[1.08/1] w-full overflow-hidden bg-[#e5e2dc]">
              <BlogImage
                blog={leadBlog}
                variant="blogHero"
                sizes="(min-width: 640px) 45vw, 100vw"
                priority
                className="object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-col items-start gap-5">
              <h3 className="break-words font-cormorant text-[2.65rem] font-semibold leading-[0.98] text-slate sm:text-[3rem]">
                {leadBlog.title}
              </h3>
              <div
                className="prototype-home-accent-divider h-px w-14"
                aria-hidden="true"
              />
              {leadDisplayDate ? (
                <time
                  dateTime={leadDisplayDate.dateTime}
                  className="font-archivo text-sm uppercase tracking-[0.08em] text-slate/65"
                >
                  {leadDisplayDate.label}
                </time>
              ) : null}
              {leadSummary ? (
                <p className="max-w-[22rem] break-words font-archivo text-base leading-7 text-slate/70">
                  {leadSummary}
                </p>
              ) : null}
              <Link
                href={getBlogHref(leadBlog.slug)}
                className="inline-flex min-h-11 items-center gap-4 font-archivo text-base text-slate transition-colors hover:text-slate/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate"
              >
                Read the full story
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </article>
      ) : (
        <div
          className="border-y border-slate/10 py-10 font-archivo text-base leading-7 text-slate/65"
          data-testid="prototype-mobile-blog-empty"
        >
          Blog entries will appear here when archive posts are available.
        </div>
      )}

      {archiveBlogs.length > 0 ? (
        <div className="flex min-w-0 flex-col gap-5">
          <div className="prototype-home-accent-divider h-px w-full" />
          <p className="prototype-home-accent-text font-archivo text-xs uppercase tracking-[0.28em]">
            Journal archive
          </p>
          <ul className="min-w-0" data-testid="prototype-mobile-blog-archive">
            {archiveBlogs.map((blog) => (
              <MobileBlogArchiveRow key={blog.slug} blog={blog} />
            ))}
          </ul>
        </div>
      ) : null}

      <Link
        href="/blog"
        className="prototype-home-accent-border mt-2 flex min-h-[64px] w-full items-center justify-between border px-5 font-archivo text-base text-slate transition-colors hover:bg-slate hover:text-whitish focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate sm:px-7"
      >
        <span className="min-w-0 break-words">Browse all journal entries</span>
        <ArrowRight aria-hidden="true" className="ml-4 h-5 w-5 shrink-0" />
      </Link>
    </div>
  );
}

function BlogPrototypeCard({ blog }: { blog: BlogEntryFrontend }) {
  const summary = getBlogSummary(blog);

  return (
    <article className="group min-w-0">
      <Link
        href={getBlogHref(blog.slug)}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e5e2dc] 2xl:aspect-[3/2]">
          <BlogImage
            blog={blog}
            variant="blogGridCard"
            sizes="(min-width: 1536px) 22vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="mt-5 flex min-w-0 flex-col gap-2 2xl:gap-3">
          <h3 className="min-w-0 break-words font-cormorant text-2xl font-semibold leading-none text-slate md:text-3xl 2xl:text-[34px]">
            {blog.title}
          </h3>
          {summary ? (
            <p className="line-clamp-3 min-w-0 break-words font-archivo text-sm leading-6 text-slate/70 2xl:max-w-[24rem]">
              {summary}
            </p>
          ) : null}
          <ArrowRight
            aria-hidden="true"
            className="mt-1 h-6 w-6 text-slate transition-transform duration-300 group-hover:translate-x-2"
            strokeWidth={1.5}
          />
        </div>
      </Link>
    </article>
  );
}

export function BlogPrototypeSection({
  blogs,
  useAlternateBackground = true,
}: BlogPrototypeSectionProps) {
  const [leadBlog, ...secondaryBlogs] = blogs;
  const cardBlogs = secondaryBlogs.slice(0, 4);
  const mobileArchiveBlogs = secondaryBlogs.slice(0, mobileArchiveLimit);
  const leadSummary = leadBlog ? getBlogSummary(leadBlog) : "";
  const backgroundClassName = useAlternateBackground
    ? "prototype-home-alt-bg"
    : "prototype-home-primary-bg";

  return (
    <section
      aria-label="Journal"
      className={`${backgroundClassName} w-full border-t border-slate/10 text-slate`}
      data-testid="prototype-blog-section"
    >
      <MobileBlogSection
        leadBlog={leadBlog}
        archiveBlogs={mobileArchiveBlogs}
      />

      <div
        className={`${prototypeSectionFrameClassName} hidden flex-col gap-14 py-16 md:flex md:py-20 lg:gap-16 lg:py-24 2xl:gap-20 2xl:py-28`}
        data-testid="prototype-desktop-blog"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(320px,0.62fr)_minmax(0,1.38fr)] lg:gap-14 xl:gap-16 2xl:grid-cols-[minmax(380px,0.56fr)_minmax(0,1.44fr)] 2xl:gap-24">
          <div className="flex min-w-0 flex-col items-start gap-7 2xl:gap-8">
            <div className="flex min-w-0 max-w-[780px] flex-col gap-4">
              <p className={prototypeSectionEyebrowClassName}>Blog</p>
              <h2
                id={sectionHeadingId}
                className="prototype-home-section-heading max-w-[780px] break-words font-cormorant text-4xl font-semibold leading-tight text-slate sm:text-5xl lg:text-6xl"
                style={sectionHeadingStyle}
              >
                {leadBlog?.title ?? "Latest blog posts"}
              </h2>
            </div>
            <div
              className="prototype-home-accent-divider h-px w-16"
              aria-hidden="true"
            />
            {leadSummary ? (
              <p className="max-w-xl break-words font-archivo text-base leading-7 text-slate/80 sm:text-lg 2xl:max-w-[700px]">
                {leadSummary}
              </p>
            ) : null}
            <Link
              href="/blog"
              className="inline-flex min-h-[56px] w-full max-w-[240px] items-center justify-between border border-slate px-7 font-archivo text-base font-semibold text-slate transition-colors hover:bg-slate hover:text-whitish focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate"
            >
              Read more
              <ArrowRight aria-hidden="true" className="h-6 w-6" />
            </Link>
          </div>

          {leadBlog ? (
            <Link
              href={getBlogHref(leadBlog.slug)}
              className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate"
            >
              <div className="relative aspect-[1.12/1] w-full overflow-hidden bg-[#e5e2dc] xl:aspect-[1.35/1] 2xl:aspect-[1.58/1]">
                <BlogImage
                  blog={leadBlog}
                  variant="blogHero"
                  sizes="(min-width: 1536px) 58vw, (min-width: 1024px) 52vw, 100vw"
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
            </Link>
          ) : (
            <div className="relative flex aspect-[1.12/1] w-full items-center justify-center bg-[#e5e2dc] px-8 text-center font-archivo text-sm leading-6 text-slate/60">
              Blog entries will appear here when archive posts are available.
            </div>
          )}
        </div>

        {cardBlogs.length > 0 ? (
          <div className="grid gap-x-8 gap-y-12 border-t border-slate/10 pt-10 sm:grid-cols-2 lg:grid-cols-4 2xl:gap-x-12 2xl:pt-12">
            {cardBlogs.map((blog) => (
              <BlogPrototypeCard key={blog.slug} blog={blog} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
