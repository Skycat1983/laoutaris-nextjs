import { ReactNode } from "react";

interface GridLayoutProps {
  children: ReactNode;
}

export const BlogGrid = ({ children }: GridLayoutProps) => {
  return (
    <section className="grid grid-cols-1 grid-rows-4 sm:grid-cols-2 sm:grid-rows-3 lg:grid-cols-4 lg:grid-rows-1 p-4 w-full py-8 gap-5">
      {children}
    </section>
  );
};

export const CollectionGrid = ({ children }: GridLayoutProps) => {
  return (
    <section className="grid grid-cols-1 grid-rows-6 sm:grid-cols-2 sm:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2 p-4 w-full py-8 gap-5">
      {children}
    </section>
  );
};
