import Image from "next/image";
import ButtonDivider from "@/components/ui/common/ButtonDivider";
import HorizontalDivider from "@/components/ui/common/HorizontalDivider";
import SectionHeading from "@/components/ui/common/SectionHeading";
import { CollectionCardData } from "@/components/loaders/homeCollectionSectionLoader/HomeCollectionSectionLoader";
import Link from "next/link";

interface HomeCollectionSectionProps {
  collections: CollectionCardData[];
}

export function HomeCollectionSection({
  collections,
}: HomeCollectionSectionProps) {
  return (
    <div>
      <SectionHeading
        heading="Collections:"
        subheading="Curated by the family"
      />
      <HorizontalDivider />

      <section
        data-testid="artwork-content"
        className="p-4 grid grid-cols-1 grid-rows-6 sm:grid-cols-2 sm:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2 w-full py-8 gap-5"
      >
        {collections.map((collection, index) => (
          <Link
            key={index}
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
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-4xl font-cormorant">
                {collection.title}
              </span>
            </div>
          </Link>
        ))}
      </section>
      <ButtonDivider label={"See more"} link="/collections" />
    </div>
  );
}
