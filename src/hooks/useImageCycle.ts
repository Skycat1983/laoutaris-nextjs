"use client";

import { useState } from "react";

const useImageCycle = (images: string[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return { currentImage: images[currentIndex], nextImage };
};

export default useImageCycle;
