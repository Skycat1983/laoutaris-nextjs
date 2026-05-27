import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/shadcn/skeleton";
import { getYearColor } from "@/lib/utils/colourUtils";
import type { BlogEntryFrontend } from "@/lib/data/types";
import { dateToYear } from "@/lib/utils/dateUtils";
import { getCloudinaryDeliveryUrl } from "@/lib/images/cloudinaryDelivery";
import { blogDetailPath } from "@/lib/routes/publicAppRoutes";

interface BlogsViewCardProps {
  blog: BlogEntryFrontend;
}

export const BlogsViewCard = ({ blog }: BlogsViewCardProps) => {
  return (
    <Link href={blogDetailPath(blog.slug)}>
      <div className="relative group w-full">
        <div className="relative">
          <Image
            src={getCloudinaryDeliveryUrl(blog.imageUrl, "card")}
            alt={blog.title}
            width={200}
            height={200}
            className="w-full h-[300px] shadow-xl object-cover"
            // loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
            <p
              className={`text-white/80 text-sm p-1 w-min rounded ${getYearColor(
                dateToYear(blog.displayDate)
              )}`}
            >
              {dateToYear(blog.displayDate)}
            </p>
            <h2 className="text-white text-2xl font-bold">{blog.title}</h2>
            <p className="text-white/80 text-md">{blog.subtitle}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const BlogsViewCardSkeleton = () => {
  return (
    <div className="relative group w-full">
      <Skeleton className="w-full h-[300px] shadow-xl" />
    </div>
  );
};
