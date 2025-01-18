"use client";

import { Skeleton } from "@/components/ui/shadcn/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

type BiographyCardProps = {
  entry: {
    imageUrl: string;

    title: string;
    subtitle: string;
    slug: string;
  };
};

const BiographyCard = ({ entry }: BiographyCardProps) => {
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

export default BiographyCard;

{
  /* <div
className="grid grid-cols-1 h-full"
style={{ gridTemplateRows: "120% 25%" }}
>
<div className="h-[500px] w-auto overflow-hidden flex flex-col justify-center">
  <Image
    src={entry.url}
    alt={entry.title}
    width={500}
    height={500}
    // objectFit="contain"
  />
</div>
<div className="flex flex-col gap-8 p-4 py-8">
  <h1 className="font-archivo text-2xl font-bold">{entry.title}</h1>
  <h2 className="font-archivo text-xl font-normal text-gray-500">
    {entry.subheading}
  </h2>
</div>
</div> */
}
