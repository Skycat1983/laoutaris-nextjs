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
    //   "https://res.cloudinary.com/dzncmfirr/image/upload/v1706776922/studio-thumbnails/JRL_studio1_005_ufgeas.jpg";
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

{
  /* <div className="flex gap-4 flex-col md:flex-row ">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-400"
            />
            <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div> */
}

// export function SubscribeSection({ isLoggedIn }: { isLoggedIn: boolean }) {
//   const message = isLoggedIn
//     ? "Welcome back!"
//     : "Stay up to date with our latest news and updates.";

//   return (
//     <SubscribeSectionLayout>
//       <div className="col-start-1 col-end-6 flex flex-col items-center justify-center gap-8 text-center bg-slate/10">
//         <div>
//           <h1 className="text-4xl font-cormorant">Stay up to date</h1>
//         </div>
//         <div>
//           <h1>Subscribe to our newsletter for discounts and updates.</h1>
//         </div>
//       </div>

//       <div className="bg-slate-100 border col-start-7 col-end-12">
//         <SubscribeForm />
//       </div>
//     </SubscribeSectionLayout>
//   );
// }

export function SubscribeSectionSkeleton() {
  return (
    <SubscribeSectionLayout>
      <Skeleton className="col-start-1 col-end-6 flex flex-col items-center justify-center gap-8 text-center bg-slate/10" />
    </SubscribeSectionLayout>
  );
}
