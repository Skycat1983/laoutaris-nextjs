import React from "react";
import SubscribeForm from "../ui/forms/SubscribeForm";
import { Skeleton } from "../ui/shadcn/skeleton";

export function SubscribeSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="border grid grid-cols-12 gap-4 bg-slate/5">{children}</div>
  );
}

export function SubscribeSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  const message = isLoggedIn
    ? "Welcome back!"
    : "Stay up to date with our latest news and updates.";

  return (
    <SubscribeSectionLayout>
      <div className="col-start-1 col-end-6 flex flex-col items-center justify-center gap-8 text-center bg-slate/10">
        <div>
          <h1 className="text-4xl font-cormorant">Stay up to date</h1>
        </div>
        <div>
          <h1>Subscribe to our newsletter for discounts and updates.</h1>
        </div>
      </div>

      <div className="bg-slate-100 border col-start-7 col-end-12">
        <SubscribeForm />
      </div>
    </SubscribeSectionLayout>
  );
}

export function SubscribeSectionSkeleton() {
  return (
    <SubscribeSectionLayout>
      <Skeleton className="col-start-1 col-end-6 flex flex-col items-center justify-center gap-8 text-center bg-slate/10" />
    </SubscribeSectionLayout>
  );
}
