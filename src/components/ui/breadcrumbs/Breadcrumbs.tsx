"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/shadcn/breadcrumb";
import { useSelectedLayoutSegments } from "next/navigation";
import { HouseIcon } from "lucide-react";

import React from "react";
import { ScrollArea, ScrollBar } from "../shadcn/scroll-area";

const Breadcrumbs = () => {
  const segments = useSelectedLayoutSegments();

  // TODO: disabled the last link displayed in the breadcrumb

  return (
    <div className="pl-4">
      <ScrollArea className="container whitespace-nowrap rounded-md h-auto">
        <Breadcrumb>
          <BreadcrumbList>
            <div className="flex flex-row justify-center items-center gap-2 sm:gap-5 md:gap-5 lg:gap-10">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <HouseIcon className="bg-whitish h-5 md:h-6 lg:h-8" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              {segments.map((segment, index) => {
                const displaySegment = /^[0-9a-fA-F]{24}$/.test(segment)
                  ? "artworkId"
                  : segment;
                return (
                  <React.Fragment key={index}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        className="font-face-default subheading font-normal text-base flex-shrink-0 lg:font-medium lg:text-lg"
                        href={`/${segments.slice(0, index + 1).join("/")}`}
                      >
                        {displaySegment}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </div>
          </BreadcrumbList>
        </Breadcrumb>
        <ScrollBar orientation="horizontal" className="p-12" />
      </ScrollArea>
    </div>
  );
};

export default Breadcrumbs;
