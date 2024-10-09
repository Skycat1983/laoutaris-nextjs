"use server";
import { ScrollArea, ScrollBar } from "../shadcn/scroll-area";
import Link from "next/link";
import PaginationItem from "./PaginationItem";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationContainerProps = {
  children: React.ReactNode;
};

const PaginationNavigationContainer = ({
  children,
}: PaginationContainerProps) => {
  return <div className="flex items-center pl-4">{children}</div>;
};

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
  stem: string;
  children: React.ReactNode;
}

const ServerPaginationLinkWrapper = ({
  artworkLink,
  collectionSlug,
  stem,
  children,
}: PaginationLinkWrapperProps) => {
  return (
    <>
      <Link
        href={`http://localhost:3000/${stem}/${collectionSlug}/${artworkLink.id}`}
      >
        {children}
      </Link>
    </>
  );
};

interface ServerPaginationProps {
  stem?: string;
  artworkLinks: ArtworkLink[];
  collectionSlug: string;
}

const ServerPagination = ({
  stem = "artwork",
  artworkLinks,
  collectionSlug,
}: ServerPaginationProps) => {
  const totalPages = artworkLinks.length;
  const idArray = artworkLinks.map((artworkLink) => artworkLink.id);

  console.log("idArray", idArray);

  return (
    <>
      <div className="flex flex-row justify-center w-full">
        <PaginationNavigationContainer>
          {/* <PrevPage idArray={idArray} /> */}
        </PaginationNavigationContainer>
        {/* <PaginationNavigationContainer> */}
        {/* <div className="flex flex-col items-center justify-center h-auto"> */}
        <ScrollArea className="container whitespace-nowrap rounded-md h-auto">
          <div className="flex w-max space-x-4 h-auto">
            {artworkLinks.map((artworkLink, i) => (
              <ServerPaginationLinkWrapper
                key={i}
                artworkLink={artworkLink}
                collectionSlug={collectionSlug}
                stem={stem}
              >
                <PaginationItem artworkLink={artworkLink} />
              </ServerPaginationLinkWrapper>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="p-12" />
        </ScrollArea>
        {/* </div> */}
        {/* </PaginationNavigationContainer> */}
        <PaginationNavigationContainer>
          {/* <NextPage /> */}
        </PaginationNavigationContainer>
      </div>
    </>
  );
};

export default ServerPagination;

// const nextPageId = (currentPageId: string, idArray: string[]) => {
//   return idArray[idArray.indexOf(currentPageId) + 1];
// };

// const prevPageId = (currentPageId: string, idArray: string[]) => {
//   return idArray[idArray.indexOf(currentPageId) - 1];
// };

{
  /* {showPrevNext && (
            <NavigationButton
              label=">"
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              googleIcon={<ChevronRight />}
            />
          )}
          {showFirstLast && (
            <NavigationButton
              label=">>"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              googleIcon={
                <span className="material-symbols-outlined">last_page</span>
              }
            />
          )} */
}
