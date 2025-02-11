"use server";

import Image from "next/image";
import ButtonDivider from "../ui/common/ButtonDivider";
import HorizontalDivider from "../ui/common/HorizontalDivider";
import SectionHeading from "../ui/common/SectionHeading";

interface HomeArtworkSectionProps {
  artworks: {
    label: string;
    url: string;
  }[];
}

const HomeArtworkSection = ({ artworks }: HomeArtworkSectionProps) => {
  return (
    <div>
      <SectionHeading heading="Artwork:" subheading="Browse his life's work" />
      <HorizontalDivider />

      <section
        data-testid="artwork-content"
        className="p-4 grid grid-cols-1 grid-rows-6 sm:grid-cols-2 sm:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2 w-full py-8 gap-5"
      >
        {artworks.map((artwork, index) => (
          <div
            key={index}
            className="relative row-span-1 col-span-1 h-64 overflow-hidden group"
          >
            <Image
              src={artwork.url}
              alt={artwork.label}
              height={500}
              width={500}
              className="w-full h-full object-cover transform transition-transform duration-1000 ease-in-out group-hover:scale-110"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-4xl font-cormorant">
                {artwork.label}
              </span>
            </div>
          </div>
        ))}
      </section>
      <ButtonDivider label={"See more"} link="/artwork" />
    </div>
  );
};

export default HomeArtworkSection;
