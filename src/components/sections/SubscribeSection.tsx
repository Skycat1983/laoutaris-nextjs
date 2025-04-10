import React from "react";
import SubscribeForm from "../modules/forms/user/SubscribeForm";
import { Skeleton } from "../shadcn/skeleton";
import Image from "next/image";
import { NewLogoLight2 } from "../elements/icons/NewLogos";

export function SubscribeSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="border grid grid-cols-12 gap-4 bg-slate/5">{children}</div>
  );
}

interface SubscribeSectionProps {
  isLoggedIn: boolean;
}

export const SubscribeSection: React.FC<SubscribeSectionProps> = ({
  isLoggedIn,
}) => {
  const url =
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1706776926/studio-thumbnails/JRL_studio1_012_smdlzw.jpg";
  return (
    <div className="w-full bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Image
          src={url}
          alt="Studio background"
          fill
          className="object-cover"
        />
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8 py-16 px-8 relative">
        <div className="col-span-9 md:col-span-6 flex flex-col justify-center">
          <div className="flex justify-end w-full block md:hidden">
            <NewLogoLight2 />
          </div>
          <h2 className="text-5xl font-light mb-6">Join Our Mailing List</h2>
          <p className="text-gray-300 text-lg mb-8">
            {isLoggedIn
              ? "To receive our newsletter, please enter your email below."
              : "Experience art through our curator's lens"}
          </p>
          <SubscribeForm />
        </div>
        <div className="hidden md:flex md:col-span-6 md:items-center md:justify-end">
          <NewLogoLight2 />
        </div>
      </div>
    </div>
  );
};

export function SubscribeSectionSkeleton() {
  return (
    <SubscribeSectionLayout>
      <Skeleton className="col-start-1 col-end-6 flex flex-col items-center justify-center gap-8 text-center bg-slate/10" />
    </SubscribeSectionLayout>
  );
}
