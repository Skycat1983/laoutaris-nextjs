"use client";

import { Transition } from "@headlessui/react";

type ArtworkImageProps = {
  src: string;
  alt: string;
  isShowing: boolean;
};

const ArtworkImage = ({ src, alt, isShowing }: ArtworkImageProps) => {
  return (
    <div className="flex items-start p-4 md:justify-center lg:justify-end">
      <Transition
        show={isShowing}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <img
          style={{
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
          }}
          className="max-h-screen max-w-full object-contain"
          src={src}
          alt={alt}
        />
      </Transition>
    </div>
  );
};

export default ArtworkImage;
