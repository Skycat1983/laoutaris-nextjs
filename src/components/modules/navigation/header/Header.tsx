"use server";

import Breadcrumbs from "@/components/modules/navigation/breadcrumbs/Breadcrumbs";
import Searchbar from "@/components/elements/inputs/Searchbar";
import { Suspense } from "react";
import { MainNavLoader } from "@/components/loaders/componentLoaders/MainNavLoader";
import { MainNavSkeleton } from "../mainNav/MainNav";

export async function Header({ className }: { className?: string }) {
  return (
    <>
      <header className={`fixed top-0 z-10 w-full bg-whitish ${className}`}>
        {/* <Suspense fallback={<MainNavSkeleton />}> */}
        <MainNavLoader />
        {/* </Suspense> */}

        <div className="flex flex-col w-full bg-whitish px-4 py-0 lg:py-0">
          <hr className="flex flex-row flex-grow" />
          <div className="flex items-center grow justify-between min-h-[50px] px-0">
            <Breadcrumbs />
            <div className="hidden md:block">
              <Searchbar />
            </div>
          </div>
          <hr className="flex flex-row flex-grow" />
        </div>
      </header>
    </>
  );
}
