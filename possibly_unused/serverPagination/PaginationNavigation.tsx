"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";

type Props = {
  icon: React.ReactNode;
  onClick?: () => void;
};

const PrevPage = (idArray: string[]) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const segment = useSelectedLayoutSegment();

  return (
    <>
      <ChevronLeft />
    </>
  );
};

const NextPage = (idArray: string[]) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const segment = useSelectedLayoutSegment();

  return (
    <>
      <ChevronRight />
    </>
  );
};

const FirstPage = ({}) => {};

const LastPage = ({}) => {};

export { NextPage, PrevPage, FirstPage, LastPage };

// const PaginationNavigation = ({ icon, onClick }: Props) => {
//   return <div onClick={onClick}>{icon}</div>;
// };

// export default PaginationNavigation;
