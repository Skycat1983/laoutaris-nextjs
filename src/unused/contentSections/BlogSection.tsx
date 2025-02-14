import React from "react";
import SectionHeading from "../../components/elements/typography/SectionHeading";
import HorizontalDivider from "../../components/elements/misc/HorizontalDivider";
import Image from "next/image";
import ButtonDivider from "../../components/elements/misc/ButtonDivider";
import Link from "next/link";
import { BlogCardData } from "../../components/loaders/sectionLoaders/BlogSectionLoader";

interface HomeBlogSectionProps {
  blogs: BlogCardData[];
}

export function BlogSection({ blogs }: HomeBlogSectionProps) {
  return (
    <div>
      <SectionHeading heading="Blog:" subheading="Recent posts" />
      <HorizontalDivider />

      <section
        data-testid="artwork-content"
        className="p-4 grid grid-cols-1 grid-rows-4 sm:grid-cols-2 sm:grid-rows-3 lg:grid-cols-4 lg:grid-rows-1 w-full py-8 gap-5"
      >
        {blogs.map((blog) => (
          <Link key={blog.slug} href={`/blog/${blog.slug}`}>
            <div className="relative group w-full">
              <div className="relative">
                <Image
                  src={blog.imageUrl.replace(
                    "/upload/",
                    "/upload/w_300,q_auto/"
                  )}
                  alt={blog.title}
                  width={200}
                  height={200}
                  className="w-full h-[300px] shadow-xl object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h2 className="text-white text-2xl font-bold">
                    {blog.title}
                  </h2>
                  <p className="text-white/80 text-md">{blog.subtitle}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>
      <ButtonDivider label={"See more"} link="/blog" />
    </div>
  );
}
