import { ReactNode } from "react";

const PaginationLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-start justify-start pl-4 gap-8">{children}</div>
  );
};

export default PaginationLayout;
