import { useState, useEffect, useCallback } from "react";

interface PaginationProps {
  initialPage?: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  pageRangeDisplayed: number;
}

interface UsePaginationReturn {
  currentPage: number;
  onPageChange: (newPage: number) => void;
  isPageActive: (page: number) => boolean;
  pageNumbersToDisplay: number[];
}

// this hook manages the state of the pagination
export const usePagination = ({
  initialPage = 1,
  totalPages,
  handlePageChange,
  pageRangeDisplayed,
}: PaginationProps): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageNumbersToDisplay, setPageNumbersToDisplay] = useState<number[]>(
    []
  );

  const calculatePageNumbersToDisplay = useCallback(() => {
    const halfRangeDisplayed = Math.floor(pageRangeDisplayed / 2);
    let start: number = Math.max(currentPage - halfRangeDisplayed, 1);
    let end: number = start + pageRangeDisplayed - 1;

    if (end > totalPages) {
      start -= end - totalPages;
      end = totalPages;
    }

    if (start < 1) {
      start = 1;
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [currentPage, totalPages, pageRangeDisplayed]);

  useEffect(() => {
    setPageNumbersToDisplay(calculatePageNumbersToDisplay());
  }, [calculatePageNumbersToDisplay]);

  const isPageActive = useCallback(
    (page: number) => currentPage === page,
    [currentPage]
  );

  const onPageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        handlePageChange(newPage);
      }
    },
    [totalPages, handlePageChange]
  );

  return {
    currentPage,
    onPageChange,
    isPageActive,
    pageNumbersToDisplay,
  };
};
