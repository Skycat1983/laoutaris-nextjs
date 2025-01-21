import { ReactNode } from "react";

interface ArtworkViewLayoutProps {
  children: ReactNode;
}

const ArtworkViewLayout = ({ children }: ArtworkViewLayoutProps) => {
  return (
    <>
      <div
        className="
        grid 
        grid-rows-[minmax(0,max-content),minmax(0,1fr)] 
        gap-10
        lg:grid-cols-[1fr,1fr]
        lg:gap-4
      "
      >
        {children}
      </div>
    </>
  );
};

export default ArtworkViewLayout;
