"use server";
import { ScrollArea, ScrollBar } from "../shadcn/scroll-area";
import Link from "next/link";
import Image from "next/image";
import PaginationItem from "./PaginationItem";

export interface ArtworkLink {
  id: string;
  imageData: {
    secure_url: string;
    pixelHeight: number;
    pixelWidth: number;
  };
}

interface PaginationLinkWrapperProps {
  artworkLink: ArtworkLink;
  collectionSlug: string;
  children: React.ReactNode;
}

const ServerPaginationLinkWrapper = ({
  artworkLink,
  collectionSlug,
  children,
}: PaginationLinkWrapperProps) => {
  return (
    <>
      <Link href={`/${collectionSlug}/${artworkLink.id}`}>{children}</Link>
    </>
  );
};

interface ServerPaginationProps {
  artworkLinks: ArtworkLink[];
  collectionSlug: string;
}

const ServerPagination = ({
  artworkLinks,
  collectionSlug,
}: ServerPaginationProps) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-auto">
        <ScrollArea className="container whitespace-nowrap rounded-md h-auto">
          <div className="flex w-max space-x-4 h-auto">
            {artworkLinks.map((artworkLink, i) => (
              <ServerPaginationLinkWrapper
                key={i}
                artworkLink={artworkLink}
                collectionSlug={collectionSlug}
              >
                <PaginationItem artworkLink={artworkLink} />
              </ServerPaginationLinkWrapper>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="p-12" />
        </ScrollArea>
      </div>
    </>
  );
};

export default ServerPagination;
