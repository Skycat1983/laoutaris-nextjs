import { PrototypeSectionPlaceholder } from "./PrototypeSectionPlaceholder";
import { BlogPrototypeSection } from "./BlogPrototypeSection";
import { BiographyPrototypeSection } from "./BiographyPrototypeSection";
import { CollectionPrototypeSection } from "./CollectionPrototypeSection";
import { ShopPrototypeSection } from "./ShopPrototypeSection";
import type { ArticleFrontend } from "@/lib/data/types/articleTypes";
import type { BlogEntryFrontend } from "@/lib/data/types/blogTypes";
import type { CollectionFrontend } from "@/lib/data/types/collectionTypes";
import type { SimpleProduct } from "@/lib/data/types/shopify";

const prototypeSections = [
  {
    id: "hero",
    label: "Prototype hero",
    title: "Full-width landing hero workshop",
    description:
      "Reserved for the redesigned homepage opening section without changing the live archive homepage.",
    tone: "hero" as const,
    className: "min-h-[70vh]",
  },
  {
    id: "artwork",
    label: "Artwork",
    title: "Artwork teaser slot",
    description:
      "Placeholder for the artwork navigation category while the homepage section system is explored.",
    tone: "light" as const,
  },
  {
    id: "collections",
    label: "Collections",
    title: "Collections prototype slot",
    description:
      "Reserved for the image-guided collections section backed by the existing collection data path.",
    tone: "muted" as const,
  },
  {
    id: "biography",
    label: "Biography",
    title: "Biography prototype slot",
    description:
      "Reserved for the image-guided biography teaser section that will use the existing biography data path later.",
    tone: "dark" as const,
  },
  {
    id: "blog",
    label: "Blog",
    title: "Blog prototype slot",
    description:
      "Reserved for the image-guided blog teaser section that will use real blog entries in a later task.",
    tone: "light" as const,
  },
  {
    id: "project",
    label: "Project",
    title: "Project teaser slot",
    description:
      "Placeholder for the project navigation category so the prototype reflects the full public navbar surface.",
    tone: "muted" as const,
  },
  {
    id: "shop",
    label: "Shop",
    title: "Shop prototype slot",
    description:
      "Reserved for the image-guided shop teaser section that can use enquiry-safe product data later.",
    tone: "dark" as const,
  },
];

type HomePrototypeProps = {
  biographyArticles?: ArticleFrontend[];
  blogEntries?: BlogEntryFrontend[];
  collectionEntries?: CollectionFrontend[];
  shopProducts?: SimpleProduct[];
  shopHasLoadError?: boolean;
};

export function HomePrototype({
  biographyArticles = [],
  blogEntries = [],
  collectionEntries = [],
  shopProducts = [],
  shopHasLoadError = false,
}: HomePrototypeProps) {
  return (
    <div className="w-full bg-whitish text-slate" data-testid="prototype-home">
      {prototypeSections.map((section) => {
        if (section.id === "biography") {
          return (
            <BiographyPrototypeSection
              key={section.id}
              articles={biographyArticles}
            />
          );
        }

        if (section.id === "blog") {
          return <BlogPrototypeSection key={section.id} blogs={blogEntries} />;
        }

        if (section.id === "collections") {
          return (
            <CollectionPrototypeSection
              key={section.id}
              collections={collectionEntries}
            />
          );
        }

        if (section.id === "shop") {
          return (
            <ShopPrototypeSection
              key={section.id}
              products={shopProducts}
              hasLoadError={shopHasLoadError}
            />
          );
        }

        return (
          <PrototypeSectionPlaceholder
            key={section.id}
            id={section.id}
            label={section.label}
            title={section.title}
            description={section.description}
            tone={section.tone}
            className={section.className}
          />
        );
      })}
    </div>
  );
}
