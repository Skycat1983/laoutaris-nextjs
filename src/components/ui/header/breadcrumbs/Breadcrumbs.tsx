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

const Breadcrumbs = () => {
  const segments = useSelectedLayoutSegments();

  // TODO: disabled the last link displayed in the breadcrumb

  return (
    <div className="pl-4">
      <Breadcrumb>
        <BreadcrumbList>
          <div className="flex flex-row justify-center items-center gap-10">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <HouseIcon className="bg-whitish" />
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
                      className="font-face-default subheading text-lg font-base"
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
    </div>
  );
};

export default Breadcrumbs;
