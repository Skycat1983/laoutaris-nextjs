import Link from "next/link";
import Image from "next/image";
import {
  SearchResultItem,
  SearchableContentType,
} from "@/lib/data/types/searchTypes";

interface SearchResultsSectionProps {
  title: string;
  items: SearchResultItem[];
  type: SearchableContentType;
}

const SearchResultsSection = ({
  title,
  items,
  type,
}: SearchResultsSectionProps) => {
  if (!items?.length) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {title} ({items.length > 0 ? `${items.length}` : "No"} {type})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <Link
            key={i}
            href={item.linkTo}
            className="block transition-transform hover:scale-[1.02]"
          >
            <div className="h-full overflow-hidden">
              {item.imageUrl && (
                <div className="relative w-full h-40">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={10}
                    priority={false}
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2 line-clamp-2">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                    {item.subtitle}
                  </p>
                )}
                {item.summary && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.summary}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SearchResultsSection;
