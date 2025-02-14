"use client";

import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/shadcn/skeleton";

type BiographyCardProps = {
  entry: {
    imageUrl: string;
    title: string;
    subtitle: string;
    slug: string;
  };
};

export const BiographyCard = ({ entry }: BiographyCardProps) => {
  const { imageUrl, title, subtitle, slug } = entry;
  return (
    <Link href={`/biography/${slug}`}>
      <div className="flex flex-col">
        <div className="relative h-[300px] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex flex-col gap-4 p-4 w-[250px] whitespace-normal text-center pt-8">
          <h1 className="font-archivo text-2xl font-bold break-words">
            {title}
          </h1>
          <h2 className="font-archivo text-xl font-normal text-gray-500 break-words">
            {subtitle}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export const BiographyCardSkeleton = () => {
  return (
    <div className="relative h-[300px] w-[250px]">
      <Skeleton className="w-full h-full" />
    </div>
  );
};
