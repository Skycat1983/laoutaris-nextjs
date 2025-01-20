import React from "react";

type Props = {
  heading: string;
  subheading: string;
};

const CollectionInfo = ({ heading, subheading }: Props) => {
  return (
    <>
      <div className="w-full px-4 py-4">
        <h1 className="px-4 py-6 text-3xl font-bold">
          {heading}{" "}
          {/* <span className="text-gray-400 block sm:inline font-semibold">
            {subheading}
          </span> */}
        </h1>
      </div>
    </>
  );
};

export default CollectionInfo;
