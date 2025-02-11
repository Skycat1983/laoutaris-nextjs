import { Skeleton } from "../ui/shadcn/skeleton";

export function HomeSubscribeSectionSkeleton() {
  return (
    <div className="border grid grid-cols-12 gap-4 bg-slate/5">
      <Skeleton className="col-start-1 col-end-6 flex flex-col items-center justify-center gap-8 text-center bg-slate/10">
        {/* <div>
            <h1 className="text-4xl font-cormorant">Stay up to date</h1>
          </div>
          <div>
            <h1>Subscribe to our newsletter for discounts and updates.</h1>
          </div> */}
      </Skeleton>
    </div>
  );
}
