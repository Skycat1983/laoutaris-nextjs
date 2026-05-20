"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/shadcn/breadcrumb";
import {
  usePathname,
  useSelectedLayoutSegments,
  useSearchParams,
} from "next/navigation";
import { HouseIcon } from "lucide-react";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/shadcn/scroll-area";

type BreadcrumbLabelMap = Record<string, string>;

type BreadcrumbListItem = {
  name?: unknown;
  item?: unknown;
};

type BreadcrumbListJsonLd = {
  "@type"?: unknown;
  itemListElement?: unknown;
};

const objectIdSegmentPattern = /^[0-9a-fA-F]{24}$/;
const defaultSegment = "__DEFAULT__";

const decodeSegment = (segment: string) => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

const formatFallbackLabel = (segment: string) => {
  if (objectIdSegmentPattern.test(segment)) {
    return "Artwork";
  }

  const label = decodeSegment(segment).replace(/[-_]+/g, " ").trim();

  if (!label) {
    return segment;
  }

  return label.replace(/\b\w/g, (character) => character.toUpperCase());
};

const normalizePathname = (href: string) => {
  try {
    const pathname = new URL(href, window.location.origin).pathname;
    return pathname === "/" ? pathname : pathname.replace(/\/$/, "");
  } catch {
    return null;
  }
};

const getJsonLdItemUrl = (item: BreadcrumbListItem) => {
  if (typeof item.item === "string") {
    return item.item;
  }

  if (item.item && typeof item.item === "object" && "@id" in item.item) {
    const id = item.item["@id" as keyof typeof item.item];
    return typeof id === "string" ? id : null;
  }

  return null;
};

const readBreadcrumbLabelsFromJsonLd = (): BreadcrumbLabelMap => {
  if (typeof document === "undefined") {
    return {};
  }

  const labels: BreadcrumbLabelMap = {};
  const scripts = document.querySelectorAll<HTMLScriptElement>(
    'script[type="application/ld+json"]'
  );

  scripts.forEach((script) => {
    try {
      const jsonLd = JSON.parse(script.textContent || "{}") as
        | BreadcrumbListJsonLd
        | BreadcrumbListJsonLd[];
      const entries = Array.isArray(jsonLd) ? jsonLd : [jsonLd];

      entries.forEach((entry) => {
        if (entry["@type"] !== "BreadcrumbList") {
          return;
        }

        if (!Array.isArray(entry.itemListElement)) {
          return;
        }

        entry.itemListElement.forEach((listItem) => {
          const item = listItem as BreadcrumbListItem;
          const itemUrl = getJsonLdItemUrl(item);

          if (typeof item.name !== "string" || !itemUrl) {
            return;
          }

          const pathname = normalizePathname(itemUrl);

          if (pathname) {
            labels[pathname] = item.name;
          }
        });
      });
    } catch {
      return;
    }
  });

  return labels;
};

const BreadcrumbsFallback = () => {
  return (
    <div className="pl-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <HouseIcon className="bg-whitish h-5 md:h-6 lg:h-8" />
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

const BreadcrumbsContent = () => {
  const segments = useSelectedLayoutSegments();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [contentLabels, setContentLabels] = useState<BreadcrumbLabelMap>({});

  // Get sortby param if it exists
  const sortby = searchParams.get("sortby");

  const filteredSegments = useMemo(
    () => segments.filter((segment) => segment !== defaultSegment),
    [segments]
  );

  const breadcrumbEntries = useMemo(() => {
    const routeEntries = filteredSegments.map((segment, index) => ({
      segment,
      href: `/${filteredSegments.slice(0, index + 1).join("/")}`,
    }));

    if (!sortby) {
      return routeEntries;
    }

    const routePath = `/${filteredSegments.join("/")}`;

    return [
      ...routeEntries,
      {
        segment: sortby,
        href: `${routePath}?sortby=${encodeURIComponent(sortby)}`,
      },
    ];
  }, [filteredSegments, sortby]);

  useEffect(() => {
    const syncContentLabels = () => {
      setContentLabels(readBreadcrumbLabelsFromJsonLd());
    };

    syncContentLabels();

    if (typeof MutationObserver === "undefined") {
      return;
    }

    const observer = new MutationObserver(syncContentLabels);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

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
              {breadcrumbEntries.map(({ segment, href }, index) => {
                const contentLabel = normalizePathname(href);
                const displaySegment =
                  (contentLabel && contentLabels[contentLabel]) ||
                  formatFallbackLabel(segment);

                return (
                  <React.Fragment key={`${href}-${index}`}>
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

const Breadcrumbs = () => {
  return (
    <Suspense fallback={<BreadcrumbsFallback />}>
      <BreadcrumbsContent />
    </Suspense>
  );
};

export default Breadcrumbs;
