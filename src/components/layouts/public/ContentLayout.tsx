import React from "react";

type Props = {
  children: React.ReactNode;
  bg?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function ContentLayout({ children, bg, ...props }: Props) {
  return (
    <>
      <div
        className={`grid grid-cols-12 gap-4 py-32 ${bg ? bg : ""}`}
        {...props}
      >
        <div className="col-span-1 lg:col-span-2"></div>
        <div className="col-span-10 lg:col-span-8 flex flex-col gap-24">
          {children}
        </div>
        <div className="col-span-1 lg:col-span-2"></div>
      </div>
    </>
  );
}
