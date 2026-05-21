import type { Metadata } from "next";
import { HomePrototype } from "@/components/prototypes/home/HomePrototype";
import { getBiographyPrototypeArticles } from "@/components/prototypes/home/BiographyPrototypeLoader";
import { getBlogPrototypeEntries } from "@/components/prototypes/home/BlogPrototypeLoader";
import { getCollectionPrototypeEntries } from "@/components/prototypes/home/CollectionPrototypeLoader";
import { getShopPrototypeProducts } from "@/components/prototypes/home/ShopPrototypeLoader";

export const metadata: Metadata = {
  title: "Homepage Prototype",
  description:
    "Noindex workshop route for full-width Joseph Laoutaris homepage redesign sections.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function PrototypeHomePage() {
  const [biographyArticles, blogEntries, collectionEntries, shopData] =
    await Promise.all([
      getBiographyPrototypeArticles(),
      getBlogPrototypeEntries(),
      getCollectionPrototypeEntries(),
      getShopPrototypeProducts(),
    ]);

  return (
    <main className="w-full overflow-hidden" data-testid="prototype-home-page">
      <h1 className="sr-only">Homepage Prototype</h1>
      <HomePrototype
        biographyArticles={biographyArticles}
        blogEntries={blogEntries}
        collectionEntries={collectionEntries}
        shopProducts={shopData.products}
        shopHasLoadError={shopData.hasLoadError}
      />
    </main>
  );
}
