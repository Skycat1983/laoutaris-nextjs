"use client";

import Image from "next/image";
import Link from "next/link";
import { BlogEntryData } from "../loaders/viewLoaders/BlogListLoader";
import { ChevronRight } from "lucide-react";
import { useCallback, useState } from "react";
import { clientApi } from "@/lib/api/clientApi";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface BlogLayoutProps {
  initialBlogEntries: BlogEntryData[];
  initialPage?: number;
}

export const BlogSectionContinuous = ({
  initialBlogEntries,
  initialPage = 1,
}: BlogLayoutProps) => {
  const [blogEntries, setBlogEntries] = useState(initialBlogEntries);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = useCallback(async () => {
    try {
      const nextPage = page + 1;
      const response = await clientApi.public.blog.fetchBlogs({
        page: nextPage,
        limit: 10,
      });

      if (!response.success) {
        throw new Error("Failed to fetch blogs");
      }

      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setBlogEntries((prev) => [...prev, ...response.data]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more blogs:", error);
      throw error;
    }
  }, [page]);

  const { observerRef, isLoading, error } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore,
  });

  if (error) {
    console.error("Error in BlogSectionContinuous:", error);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-34 gap-12">
        <div className="lg:col-span-2">
          <Link href={`/blog/${blogEntries[0]?.slug}`} className="group block">
            <article className="relative rounded-3xl overflow-hidden">
              <Image
                src={blogEntries[0]?.imageUrl.replace(
                  "/upload/",
                  "/upload/w_1200,q_auto/"
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
                <h1 className="text-4xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {blogEntries[0]?.title}
                </h1>
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
                  src={blog.imageUrl.replace(
                    "/upload/",
                    "/upload/w_800,q_auto/"
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
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
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
//             src={blogEntries[0]?.imageUrl.replace(
//               "/upload/",
//               "/upload/w_1200,q_auto/"
//             )}
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
//                     src={blog.imageUrl.replace(
//                       "/upload/",
//                       "/upload/w_800,q_auto/"
//                     )}
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
