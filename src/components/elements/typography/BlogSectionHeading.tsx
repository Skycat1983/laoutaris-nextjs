import React from "react";
import HorizontalDivider from "../misc/HorizontalDivider";

type Props = {
  heading: string;
};

const BlogSectionHeading = ({ heading }: Props) => {
  // first letter of heading is uppercase
  const firstLetter = heading.charAt(0).toUpperCase();
  const restOfHeading = heading.slice(1);
  const formattedHeading = firstLetter + restOfHeading;
  return (
    <>
      <div className="py-8">
        <div className="py-8 container mx-auto">
          <HorizontalDivider />
        </div>
        <h1 className="text-6xl text-center font-thin fontface-crimson">
          {formattedHeading}
        </h1>
        <div className="py-8 container mx-auto">
          <HorizontalDivider />
        </div>
      </div>
    </>
  );
};

export default BlogSectionHeading;
