import { BlogEntryData } from "@/components/loaders/viewLoaders/BlogListLoader";
import Image from "next/image";
import Link from "next/link";

interface BlogLayoutProps {
  blogEntries: BlogEntryData[];
  next: string | null;
  prev: string | null;
}

//TODO: adapt this for artwork instead of blog entries

export const MasonryLayout = ({ blogEntries }: BlogLayoutProps) => {
  return (
    <div className="container mx-auto p-4">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {blogEntries.map((blog) => (
          <Link
            href={`/blog/${blog.slug}`}
            key={blog.slug}
            className="block mb-4 break-inside-avoid group"
          >
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src={blog.imageUrl.replace("/upload/", "/upload/w_600,q_auto/")}
                alt={blog.title}
                width={600}
                height={Math.floor(Math.random() * (600 - 300) + 300)}
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-4 h-full flex flex-col justify-end">
                  <h2 className="text-white text-xl font-bold mb-2">
                    {blog.title}
                  </h2>
                  <p className="text-white/80 text-sm">{blog.subtitle}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
