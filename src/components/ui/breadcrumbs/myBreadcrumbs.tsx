"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumbs/shadBreadcrumb";
import { usePathname } from "next/navigation";
import { HouseIcon } from "lucide-react";

import React from "react";

const MyBreadcrumbs = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((item) => item !== "");
  console.log("pathname :>> ", pathname);
  console.log("segments :>> ", segments);
  return (
    <div className="pl-4">
      <Breadcrumb>
        <BreadcrumbList>
          <div className="flex flex-row justify-center items-center gap-10">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <HouseIcon className="" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            {segments.map((segment, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="font-face-default subheading text-lg font-base"
                    href={`/${segments.slice(0, index + 1).join("/")}`}
                  >
                    {segment}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </div>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default MyBreadcrumbs;
