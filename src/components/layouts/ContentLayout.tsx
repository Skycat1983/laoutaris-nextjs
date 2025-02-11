import React from "react";
type Props = {
  children: React.ReactNode;
  bg?: string;
};

export function ContentLayout({ children, bg }: Props) {
  return (
    <>
      <div className={`grid grid-cols-12 gap-4 py-32 ${bg ? bg : ""}`}>
        <div className="col-span-1 lg:col-span-2"></div>

        <div className="col-span-10 lg:col-span-8 flex flex-col gap-24">
          {children}
        </div>
        <div className="col-span-1 lg:col-span-2"></div>
      </div>
    </>
  );
}
