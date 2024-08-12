import { IFrontendArtwork } from "@/lib/types/artworkTypes";
import { usePagination } from "./usePagination";
import NavigationButton from "./PaginationButton";
import PaginationCard from "./PaginationCard";
import { PaginationIcon, PaginationIconsContainer } from "./PaginationIcon";

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

const PaginationNumbersContainer = ({ children }: PaginationContainerProps) => {
  return <div className="flex flex-row gap-10 items-start">{children}</div>;
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
      <PaginationContainer>
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
              googleIcon={
                <span className="material-symbols-outlined">
                  arrow_back_ios
                </span>
              }
            />
          )}
        </PaginationNavigationContainer>
        <div className="flex flex-col items-center justify-center gap-5">
          <PaginationNumbersContainer>
            {pageNumbersToDisplay.map((page) => (
              <PaginationCard
                key={page}
                isActive={currentPage === page}
                onClick={() => onPageChange(page)}
                item={paginationItems[page - 1]}
              />
            ))}
          </PaginationNumbersContainer>
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
              googleIcon={
                <span className="material-symbols-outlined">
                  arrow_forward_ios
                </span>
              }
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
      </PaginationContainer>
    </>
  );
};

export default Pagination;
