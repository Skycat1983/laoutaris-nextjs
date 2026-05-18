"use client";

import { useCallback, useEffect, useRef, useState, MouseEvent } from "react";
import Image from "next/image";

interface MagnifierImageProps {
  src: string;
  width: number;
  height: number;
  alt: string;
  magnifierSize?: number;
  magnificationLevel?: number;
}

// TODO: maybe magnify the whole image, not just a portions? see list at https://www.artsy.net/artwork/ben-weiner-unique-drawing

const MagnifierImage = ({
  src,
  width,
  height,
  alt,
  magnifierSize = 150,
  magnificationLevel = 2,
}: MagnifierImageProps) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isZoomedImageLoaded, setIsZoomedImageLoaded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const zoomImageRef = useRef<HTMLImageElement | null>(null);
  const zoomLoadStartedRef = useRef(false);

  useEffect(() => {
    zoomImageRef.current = null;
    zoomLoadStartedRef.current = false;
    setIsZoomedImageLoaded(false);
  }, [src, width, height, magnificationLevel]);

  const loadZoomImage = useCallback(() => {
    if (zoomLoadStartedRef.current || isZoomedImageLoaded) return;

    zoomLoadStartedRef.current = true;
    const zoomImage = new window.Image(
      width * magnificationLevel,
      height * magnificationLevel
    );
    zoomImageRef.current = zoomImage;
    zoomImage.onload = () => {
      if (zoomImageRef.current === zoomImage) {
        setIsZoomedImageLoaded(true);
      }
    };
    zoomImage.src = src;
  }, [src, width, height, magnificationLevel, isZoomedImageLoaded]);

  const showZoom = () => {
    setShowMagnifier(true);
    loadZoomImage();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!imageRef.current) return;

    const bounds = imageRef.current.getBoundingClientRect();

    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;

    setMousePosition({ x, y });
  };

  return (
    <>
      <div
        ref={imageRef}
        className="relative"
        tabIndex={0}
        onFocus={showZoom}
        onMouseEnter={showZoom}
        onMouseLeave={() => setShowMagnifier(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          className="block mx-auto object-contain max-h-full w-auto shadow-2xl fade-in"
          // className="object-contain max-h-full w-auto shadow-2xl fade-in"
        />

        {showMagnifier && (
          <div
            className="absolute pointer-events-none border-2 border-gray-200 rounded-full overflow-hidden bg-white"
            style={{
              width: `${magnifierSize}px`,
              height: `${magnifierSize}px`,
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {!isZoomedImageLoaded ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                <span className="text-xs text-gray-600">Loading zoom...</span>
              </div>
            ) : (
              <div
                className="absolute"
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${src})`,
                  backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                  backgroundSize: `${magnificationLevel * 100}%`,
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export { MagnifierImage };
// <div className="w-full h-full flex flex-col items-center justify-center gap-2">
//   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
//   <span className="text-xs text-gray-600">Loading zoom...</span>
// </div>
