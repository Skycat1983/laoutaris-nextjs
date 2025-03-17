import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/shadcn/skeleton";
import { BlogEntryFrontend } from "@/lib/data/types/blogTypes";

interface BlogCardProps {
  blog: BlogEntryFrontend;
}

export const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <div className="relative group w-full">
        <div className="relative">
          <Image
            src={blog.imageUrl.replace("/upload/", "/upload/w_300,q_auto/")}
            alt={blog.title}
            width={200}
            height={200}
            className="w-full h-[300px] shadow-xl object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
            <h2 className="text-white text-2xl font-bold">{blog.title}</h2>
            <p className="text-white/80 text-md">{blog.subtitle}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const BlogCardSkeleton = () => {
  return (
    <div className="relative group w-full">
      <Skeleton className="w-full h-[300px] shadow-xl" />
    </div>
  );
};
