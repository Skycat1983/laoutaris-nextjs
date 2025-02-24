import React from "react";
import HorizontalDivider from "../misc/HorizontalDivider";

type Props = {
  heading: string;
};

const BlogSectionHeading = ({ heading }: Props) => {
  return (
    <>
      <div className="py-8">
        <div className="py-8 container mx-auto">
          <HorizontalDivider />
        </div>
        <h1 className="text-6xl text-center font-thin fontface-crimson">
          {heading}
        </h1>
        <div className="py-8 container mx-auto">
          <HorizontalDivider />
        </div>
      </div>
    </>
  );
};

export default BlogSectionHeading;
