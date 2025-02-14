import React from "react";
import { Skeleton } from "../../components/ui/shadcn/skeleton";

export function BlogEntriesSkeleton() {
  const arr = Array(6).fill("");

  return (
    <>
      <div className={`grid grid-cols-12 gap-4 py-6`}>
        <div className="col-span-1 xl:col-span-2"></div>

        <div className="col-span-10 xl:col-span-8 flex flex-col gap-24">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 m-5">
            {arr.map((_, i) => (
              <div key={i} className="relative group w-full">
                <div className="relative">
                  <Skeleton className="w-full h-[300px] rounded-xl" />
                </div>
              </div>
            ))}
          </section>
        </div>
        <div className="col-span-1 xl:col-span-2"></div>
      </div>
    </>
  );
}
