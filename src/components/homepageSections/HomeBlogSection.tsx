import React from "react";
import SectionHeading from "../ui/common/SectionHeading";
import HorizontalDivider from "../ui/common/HorizontalDivider";
import { BlogModel } from "@/lib/server/models";
import Image from "next/image";

const HomeBlogSection = async () => {
  const response = await BlogModel.find({})
    .sort({ updatedAt: 1 })
    .limit(4)
    .lean();
  if (!response) {
    return null;
  }
  const blogEntries = response;

  console.log("blogEntries :>> ", blogEntries);
  return (
    <div>
      <SectionHeading heading="Blog:" subheading="Recent posts" />
      <HorizontalDivider />

      <section
        data-testid="artwork-content"
        className="p-4 grid grid-cols-1 grid-rows-6 sm:grid-cols-2 sm:grid-rows-3 lg:grid-cols-4 lg:grid-rows-1 w-full py-8 gap-5"
      >
        {blogEntries.map((blog, index) => (
          <div className="relative group w-full">
            <div className="relative">
              <Image
                src={blog.imageUrl.replace("/upload/", "/upload/w_300,q_auto/")}
                alt={blog.title}
                width={200}
                height={200}
                className="w-full h-[300px] shadow-xl object-cover"
                loading="lazy"
              />
              {/* Overlay with gradient background */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h2 className="text-white text-2xl font-bold">{blog.title}</h2>
                <p className="text-white/80 text-md">{blog.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomeBlogSection;
