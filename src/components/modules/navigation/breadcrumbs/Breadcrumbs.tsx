"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/shadcn/breadcrumb";
import { useSelectedLayoutSegments, useSearchParams } from "next/navigation";
import { HouseIcon } from "lucide-react";

import React from "react";
import { ScrollArea, ScrollBar } from "@/components/shadcn/scroll-area";

const Breadcrumbs = () => {
  const segments = useSelectedLayoutSegments();
  const searchParams = useSearchParams();

  const toFilterOut = "__DEFAULT__";
  // Get sortby param if it exists
  const sortby = searchParams.get("sortby");

  // Create combined segments including search params
  const allSegments = sortby ? [...segments, sortby] : segments;

  const filteredSegments = allSegments.filter(
    (segment) => segment !== toFilterOut
  );

  console.log("allSegments", allSegments);

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
              {filteredSegments.map((segment, index) => {
                // Handle different segment types
                const displaySegment = /^[0-9a-fA-F]{24}$/.test(segment)
                  ? "artworkId"
                  : segment;

                // Build href considering if it's a search param
                const href =
                  index === segments.length
                    ? `/${segments.join("/")}?sortby=${segment}` // For sortby param
                    : `/${segments.slice(0, index + 1).join("/")}`; // For regular segments

                return (
                  <React.Fragment key={index}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        className="font-face-default subheading font-normal text-base flex-shrink-0 lg:font-medium lg:text-lg"
                        href={href}
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
