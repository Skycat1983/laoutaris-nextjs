import { CollectionCardData } from "@/components/loaders/sectionLoaders/CollectionSectionLoader";
import Image from "next/image";
import Link from "next/link";

type CollectionCardProps = {
  collection: CollectionCardData;
};

export const CollectionCard = ({ collection }: CollectionCardProps) => {
  return (
    <Link
      href={`/collections/${collection.slug}/${collection.artworks[0]}`}
      className="relative row-span-1 col-span-1 h-64 overflow-hidden group"
    >
      <Image
        src={collection.imageUrl}
        alt={collection.title}
        height={500}
        width={500}
        className="w-full h-full object-cover transform transition-transform duration-1000 ease-in-out group-hover:scale-110"
      />
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-4xl font-cormorant text-center p-4">
          {collection.title}
        </span>
      </div>
    </Link>
  );
};

export const CollectionCardSkeleton = () => (
  <div className="relative row-span-1 col-span-1 h-64 overflow-hidden group">
    <div className="w-full h-full bg-gray-200 animate-pulse" />
  </div>
);
