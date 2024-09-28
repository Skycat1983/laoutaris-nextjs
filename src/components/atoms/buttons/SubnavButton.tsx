"use client";

import React from "react";
import { Button } from "@/components/ui/shadcn/button";

interface SubnavButtonProps {
  title: string;
  slug: string;
}

const SubnavButton = ({ title, slug }: SubnavButtonProps) => {
  return (
    <Button
      shape={"rounded"}
      size={"full"}
      // disabled={pending}
      // variant={"outline"}
    >
      {title}
    </Button>
  );
};
export default SubnavButton;

//! old version before shadcn
// const SubnavButton = ({ title, slug }: SubnavButtonProps) => {
//   const pathname = usePathname();
//   const isActive = pathname.includes(slug);

//   const activeClasses =
//     "p-4 border border-[2px] w-[150px] subheading my-auto border-black bg-black text-white text-center";
//   const inactiveClasses =
//     "p-4 border border-[2px] w-[150px] subheading my-auto border-gray-800 text-gray-800  text-center cursor-pointer";

//   return (
// <div className={isActive ? activeClasses : inactiveClasses}>
//   <h2>{title}</h2>
// </div>
//   );
// };
