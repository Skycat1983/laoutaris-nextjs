import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogEntryFrontend } from "@/lib/data/types/blogTypes";
import { getCloudinaryDeliveryUrl } from "@/lib/images/cloudinaryDelivery";

type BlogPrototypeSectionProps = {
  blogs: BlogEntryFrontend[];
};

const sectionHeadingId = "prototype-blog-heading";

const getBlogHref = (slug: string) => `/blog/${slug}`;

const getBlogSummary = (blog: BlogEntryFrontend) =>
  blog.subtitle?.trim() || blog.summary?.trim() || "";

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

function BlogPrototypeCard({ blog }: { blog: BlogEntryFrontend }) {
  const summary = getBlogSummary(blog);

  return (
    <article className="group min-w-0">
      <Link
        href={getBlogHref(blog.slug)}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e5e2dc]">
          <BlogImage
            blog={blog}
            variant="blogGridCard"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="mt-4 flex min-w-0 flex-col gap-2">
          <h3 className="min-w-0 break-words font-cormorant text-2xl font-semibold leading-none text-slate md:text-3xl">
            {blog.title}
          </h3>
          {summary ? (
            <p className="min-w-0 break-words font-archivo text-sm leading-6 text-slate/70">
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

export function BlogPrototypeSection({ blogs }: BlogPrototypeSectionProps) {
  const [leadBlog, ...secondaryBlogs] = blogs;
  const cardBlogs = secondaryBlogs.slice(0, 4);
  const leadSummary = leadBlog ? getBlogSummary(leadBlog) : "";

  return (
    <section
      aria-labelledby={sectionHeadingId}
      className="w-full border-t border-slate/10 bg-whitish text-slate"
      data-testid="prototype-blog-section"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-14 px-4 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <div className="flex min-w-0 flex-col items-start gap-7">
            <div className="flex min-w-0 flex-col gap-4">
              <p className="font-archivo text-xs uppercase text-slate/80">
                Blog
              </p>
              <h2
                id={sectionHeadingId}
                className="max-w-3xl break-words font-cormorant text-5xl font-semibold leading-none text-slate sm:text-6xl lg:text-7xl"
              >
                {leadBlog?.title ?? "Latest blog posts"}
              </h2>
            </div>
            <div className="h-px w-16 bg-slate" aria-hidden="true" />
            {leadSummary ? (
              <p className="max-w-xl break-words font-archivo text-base leading-7 text-slate/80 sm:text-lg">
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
              <div className="relative aspect-[1.12/1] w-full overflow-hidden bg-[#e5e2dc]">
                <BlogImage
                  blog={leadBlog}
                  variant="blogHero"
                  sizes="(min-width: 1024px) 52vw, 100vw"
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
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {cardBlogs.map((blog) => (
              <BlogPrototypeCard key={blog.slug} blog={blog} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
