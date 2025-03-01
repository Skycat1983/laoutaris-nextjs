"use server";

import dbConnect from "@/lib/db/mongodb";
import { Suspense } from "react";
import { PaginationSkeleton } from "@/components/modules/pagination/CollectionViewPagination";
import { CollectionArtworksPaginationLoader } from "@/components/loaders/componentLoaders/CollectionArtworksPaginationLoader";
import HorizontalDivider from "@/components/elements/misc/HorizontalDivider";
import { SubscribeSection } from "@/components/sections";

export default async function CollectionSlugLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  await dbConnect();
  const { slug } = params;

  return (
    <section className="">
      {children}
      {/* <div className="w-full flex flex-row justify-center"> */}
      {/* <div className="w-4/5"> */}
      <Suspense fallback={<PaginationSkeleton />}>
        <CollectionArtworksPaginationLoader slug={slug} />
      </Suspense>
      {/* </div> */}
      {/* </div> */}

      {/* <div className="px-4 pb-16">
        <HorizontalDivider />
      </div> */}
      {/* <div className="container mx-auto pb-16">
        <SubscribeSection isLoggedIn={false} />
      </div> */}
    </section>
  );
}

{
  /* <div className="flex flex-row w-full justify-center">
        <div className="px-4 py-4">
          <ArtistProfile imageUrl={url} />
        </div>
        <div className="px-4 py-4 w-1/3">
          <TabbedCollectionInfo {...defaultProps} />
          <CollectionMagazineCard4 {...defaultProps} />
        </div>
      </div> */
}

{
  /* <TimelineCard artwork={artwork} isLoggedIn={false} /> */
}

{
  /* <ArtworkMagazineCard artwork={artwork} isLoggedIn={false} /> */
}
{
  /* <ArtworkMagazineCard2 artwork={artwork} isLoggedIn={false} /> */
}

{
  /* <ClassicMuseumCard artwork={artwork} isLoggedIn={false} /> */
}

{
  /* <ContemporaryGridCard artwork={artwork} isLoggedIn={false} /> */
}

{
  /* <h1 className="px-4 py-6 text-2xl font-bold">
        More from this collection
      </h1> */
}

{
  /* <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <div className="flex flex-col w-full p-4 md:flex-row lg:px-24">
        <div className="flex flex-col">
          <h1 className="px-4 py-6 text-2xl font-bold">
            About this collection
          </h1>

          <p className="px-4 text-primary py-8">
            There are {paginationData.length} pieces in this collection.
          </p>
        </div>

        <div className="px-4 py-8 md:hidden">
          <HorizontalDivider />
        </div>
        <div className="bg-slate-800/10 w-full flex flex-col w-full">
          <ArtistProfile />
        </div>
      </div>

      <div className="px-4 py-4">
        <HorizontalDivider />
      </div>
      <div className="px-4 w-full md:w-1/2 mx-auto">
        <h1 className=" py-6 text-2xl font-bold">Subscribe for updates</h1>
        <SubscribeForm />
      </div>
      <div className="px-4 py-4">
        <HorizontalDivider />
      </div> */
}

{
  /* <div className="px-4 py-8">
        <HorizontalDivider />
      </div> */
}
