"use client";

import Image from "next/image";
import Link from "next/link";
import type { ChevronRight } from "lucide-react";
import { useCallback, useState } from "react";
import { clientApi } from "@/lib/api/clientApi";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { LoadingStatus } from "@/components/elements/misc/LoadingStatus";
import type { BlogEntryFrontend } from "@/lib/data/types/blogTypes";
import { getCloudinaryDeliveryUrl } from "@/lib/images/cloudinaryDelivery";

type BlogSectionSortBy = "latest" | "oldest" | "popular" | "featured";

interface BlogLayoutProps {
  initialBlogEntries: BlogEntryFrontend[];
  initialPage?: number;
  initialHasMore?: boolean;
  sortby?: BlogSectionSortBy;
}

export const BlogSectionContinuous = ({
  initialBlogEntries,
  initialPage = 1,
  initialHasMore = true,
  sortby,
}: BlogLayoutProps) => {
  const [blogEntries, setBlogEntries] = useState(initialBlogEntries);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialHasMore);

  const handleLoadMore = useCallback(async () => {
    const nextPage = page + 1;
    const response = await clientApi.public.blog.multiple({
      page: nextPage,
      limit: 10,
      ...(sortby ? { sortby } : {}),
    });

    if (!response.success) {
      throw new Error("Failed to fetch blogs");
    }

    if (response.data.length === 0) {
      setHasMore(false);
    } else {
      setBlogEntries((prev) => [...prev, ...response.data]);
      setPage(nextPage);
      setHasMore(
        response.metadata ? nextPage < response.metadata.totalPages : true
      );
    }
  }, [page, sortby]);

  const { observerRef, isLoading, error, retry } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore,
  });

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-34 gap-12">
        <div className="lg:col-span-2">
          <Link href={`/blog/${blogEntries[0]?.slug}`} className="group block">
            <article className="relative rounded-3xl overflow-hidden">
              <Image
                src={getCloudinaryDeliveryUrl(
                  blogEntries[0]?.imageUrl,
                  "blogHero"
                )}
                alt={blogEntries[0]?.title || ""}
                width={1200}
                height={600}
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="text-emerald-400 mb-4">
                  May 2024 • Editor&apos;s Pick
                </div>
                <h2 className="text-4xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {blogEntries[0]?.title}
                </h2>
                <p className="text-white/80 text-xl">
                  {blogEntries[0]?.subtitle}
                </p>
              </div>
            </article>
          </Link>
        </div>

        {/* Secondary Articles */}
        {blogEntries.slice(1).map((blog) => (
          <Link href={`/blog/${blog.slug}`} key={blog.slug} className="group">
            <article className="flex flex-col gap-4">
              <div className="aspect-[16/10] relative rounded-2xl overflow-hidden">
                <Image
                  src={getCloudinaryDeliveryUrl(
                    blog.imageUrl,
                    "blogGridCard"
                  )}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div>
                <div className="text-emerald-600 text-sm mb-2">June 2024</div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-emerald-600 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-gray-600">{blog.subtitle}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Observer Element */}
      <div ref={observerRef} className="h-4 w-full">
        {isLoading && (
          <LoadingStatus
            label="Loading more blog posts"
            className="flex py-4"
            iconClassName="text-gray-900"
          />
        )}
        {error && (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 py-4 text-center text-red-600"
          >
            <p>
              Unable to load more blog posts. The posts already loaded are
              still shown.
            </p>
            <button
              type="button"
              onClick={retry}
              className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// export const BlogSectionContinuous = ({ blogEntries }: BlogLayoutProps) => {
//   return (
//     <>
// <div className="container mx-auto p-4">
//   <div className="grid grid-cols-1 lg:grid-cols-34 gap-12">

//     <div className="lg:col-span-2">
//       <Link
//         href={`/blog/${blogEntries[0]?.slug}`}
//         className="group block"
//       >
//         <article className="relative rounded-3xl overflow-hidden">
//           <Image
//             src={getCloudinaryDeliveryUrl(blogEntries[0]?.imageUrl, "blogHero")}
//             alt={blogEntries[0]?.title || ""}
//             width={1200}
//             height={600}
//             className="w-full h-[600px] object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
//           <div className="absolute bottom-0 left-0 right-0 p-8">
//             <div className="text-emerald-400 mb-4">
//               May 2024 • Editor&apos;s Pick
//             </div>
//             <h1 className="text-4xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
//               {blogEntries[0]?.title}
//             </h1>
//             <p className="text-white/80 text-xl">
//               {blogEntries[0]?.subtitle}
//             </p>
//           </div>
//         </article>
//       </Link>
//     </div>

//           {blogEntries.slice(1).map((blog) => (
//             <Link href={`/blog/${blog.slug}`} key={blog.slug} className="group">
//               <article className="flex flex-col gap-4">
//                 <div className="aspect-[16/10] relative rounded-2xl overflow-hidden">
//                   <Image
//                     src={getCloudinaryDeliveryUrl(blog.imageUrl, "blogGridCard")}
//                     alt={blog.title}
//                     fill
//                     className="object-cover transition-transform duration-300 group-hover:scale-105"
//                   />
//                 </div>
//                 <div>
//                   <div className="text-emerald-600 text-sm mb-2">June 2024</div>
//                   <h2 className="text-2xl font-bold mb-2 group-hover:text-emerald-600 transition-colors">
//                     {blog.title}
//                   </h2>
//                   <p className="text-gray-600">{blog.subtitle}</p>
//                 </div>
//               </article>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };
