import { IFrontendArtwork } from "@/lib/types/artworkTypes";
import { usePagination } from "./usePagination";
import NavigationButton from "./PaginationButton";
import PaginationCard from "./PaginationCard";
import { PaginationIcon, PaginationIconsContainer } from "./PaginationIcon";
import { ScrollArea, ScrollBar } from "../shadcn/scroll-area";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationContainerProps = {
  children: React.ReactNode;
};

const PaginationContainer = ({ children }: PaginationContainerProps) => {
  return <div className="flex flex-row justify-center">{children}</div>;
};

const PaginationNavigationContainer = ({
  children,
}: PaginationContainerProps) => {
  return <div className="flex items-center px-4">{children}</div>;
};

interface PaginationProps {
  totalPages: number;
  handlePageChange: (page: number) => void;
  pageRangeDisplayed: number;
  showFirstLast: boolean;
  showPrevNext: boolean;
  paginationItems: IFrontendArtwork[];
  initialPage?: number;
}
const Pagination = ({
  totalPages,
  handlePageChange,
  pageRangeDisplayed,
  initialPage,
  showFirstLast = false,
  showPrevNext = false,
  paginationItems,
}: PaginationProps) => {
  const { currentPage, onPageChange, pageNumbersToDisplay } = usePagination({
    initialPage,
    totalPages,
    handlePageChange,
    pageRangeDisplayed,
  });

  return (
    <>
      <div className="flex flex-row justify-center">
        <PaginationNavigationContainer>
          {showFirstLast && (
            <NavigationButton
              label="<<"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              googleIcon={
                <span className="material-symbols-outlined">first_page</span>
              }
            />
          )}
          {showPrevNext && (
            <NavigationButton
              label="<"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              googleIcon={<ChevronLeft />}
            />
          )}
        </PaginationNavigationContainer>
        <div className="flex flex-col items-center justify-center h-auto">
          <ScrollArea className="container whitespace-nowrap rounded-md h-auto">
            <div className="flex w-max space-x-4 h-auto">
              {pageNumbersToDisplay.map((page, i) => (
                <PaginationCard
                  key={page}
                  isActive={currentPage === page}
                  onClick={() => onPageChange(page)}
                  item={paginationItems[page - 1]}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="p-12" />
          </ScrollArea>

          <PaginationIconsContainer>
            {pageNumbersToDisplay.map((page) => (
              <PaginationIcon
                key={page}
                isActive={currentPage === page}
                onClick={() => onPageChange(page)}
              />
            ))}
          </PaginationIconsContainer>
        </div>

        <PaginationNavigationContainer>
          {showPrevNext && (
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
          )}
        </PaginationNavigationContainer>
      </div>
    </>
  );
};

export default Pagination;

// <figure key={i} className="w-full">
//   <div className="overflow-hidden rounded-md">
//     <Image
//       src={paginationItems[page - 1].image.secure_url}
//       alt={`ENTER SOMETHING`}
//       className="aspect-[3/4] h-fit w-fit object-cover"
//       width={300}
//       height={400}
//     />
//   </div>
// </figure>
