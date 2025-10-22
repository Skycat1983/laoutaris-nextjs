"use client";

import React from "react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Button } from "../../shadcn/button";

interface UploadButtonProps {
  onUploadSuccess: (result: CloudinaryUploadWidgetResults) => void;
}

export const UploadButton = ({ onUploadSuccess }: UploadButtonProps) => {
  const [isWidgetReady, setIsWidgetReady] = React.useState(false);

  React.useEffect(() => {
    console.log("UploadButton mounted, checking for Cloudinary script...");
    console.log(
      "window.cloudinary exists: ",
      typeof window !== "undefined" && !!(window as any).cloudinary
    );

    // Check if script loads over time
    const checkInterval = setInterval(() => {
      console.log(
        "Checking Cloudinary availability: ",
        typeof window !== "undefined" && !!(window as any).cloudinary
      );
    }, 2000);

    return () => clearInterval(checkInterval);
  }, []);

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    console.log("result in UploadButton", result);
    onUploadSuccess(result);
  };

  const handleOpen = (widgetInfo: any) => {
    console.log("✅ onOpen callback - widget opened: ", widgetInfo);
    setIsWidgetReady(true);

    // Check if widget UI is in the DOM
    setTimeout(() => {
      const cloudinaryWidget = document.querySelector(".cloudinary-widget");
      const cloudinaryOverlay = document.querySelector('[class*="cloudinary"]');
      const allIframes = document.querySelectorAll("iframe");

      console.log("🔍 Checking widget DOM elements after open:");
      console.log("Cloudinary widget element found: ", !!cloudinaryWidget);
      console.log("Any cloudinary element found: ", !!cloudinaryOverlay);
      console.log("Total iframes in document: ", allIframes.length);
      console.log("All iframes: ", allIframes);

      // Inspect each iframe in detail
      allIframes.forEach((iframe, index) => {
        const styles = window.getComputedStyle(iframe);
        const rect = iframe.getBoundingClientRect();

        console.log(`\n📋 IFRAME ${index} DETAILS:`);
        console.log("  ID:", iframe.id);
        console.log("  Class:", iframe.className);
        console.log("  Src:", iframe.src);
        console.log("  Display:", styles.display);
        console.log("  Visibility:", styles.visibility);
        console.log("  Opacity:", styles.opacity);
        console.log("  Position:", styles.position);
        console.log("  Z-Index:", styles.zIndex);
        console.log("  Width:", styles.width, "Height:", styles.height);
        console.log("  BoundingRect:", {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right,
        });
        console.log(
          "  InViewport:",
          rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth
        );
      });

      // Check all elements with high z-index
      const allElements = document.querySelectorAll("*");
      const highZIndexElements = Array.from(allElements).filter((el) => {
        const zIndex = window.getComputedStyle(el).zIndex;
        return zIndex !== "auto" && parseInt(zIndex) > 1000;
      });
      console.log(
        "\nElements with z-index > 1000: ",
        highZIndexElements.length
      );
    }, 500);
  };

  const handleAbort = (widgetInfo: any) => {
    console.log("⚠️ onAbort callback - widget aborted: ", widgetInfo);
  };

  const handleClose = () => {
    console.log("🔒 onClose callback - widget closed");
  };

  const handleError = (error: any) => {
    console.error("❌ onError callback - widget error: ", error);
  };

  return (
    <CldUploadWidget
      uploadPreset="laoutaris_art"
      signatureEndpoint="/api/v2/admin/sign-cloudinary-params"
      options={{
        sources: ["local", "google_drive", "dropbox"],
        multiple: false,
        maxFiles: 1,
        maxFileSize: 10000000,
      }}
      onSuccess={handleUploadSuccess}
      onOpen={handleOpen}
      onAbort={handleAbort}
      onClose={handleClose}
      onError={handleError}
    >
      {(renderProps) => {
        console.log("🔄 Render function called");
        console.log("📦 Full renderProps: ", renderProps);
        console.log("⏳ renderProps.isLoading: ", renderProps?.isLoading);
        console.log("🌐 renderProps.cloudinary: ", renderProps?.cloudinary);
        console.log("🎛️ renderProps.widget: ", renderProps?.widget);
        console.log("❌ renderProps.error: ", renderProps?.error);
        console.log("✨ open function exists: ", !!renderProps?.open);
        console.log(
          "🔑 All renderProps keys: ",
          Object.keys(renderProps || {})
        );

        const { open, isLoading, cloudinary, widget, error } =
          renderProps || {};

        return (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-whitish"
            disabled={isLoading}
            onClick={() => {
              console.log("=== 🖱️ BUTTON CLICKED ===");
              console.log("isLoading: ", isLoading);
              console.log("open exists: ", !!open);
              console.log("cloudinary exists: ", !!cloudinary);
              console.log("widget exists: ", !!widget);
              console.log("error: ", error);

              if (!isLoading && open) {
                console.log("✅ Widget is ready, calling open()...");
                open();
              } else {
                console.warn("⚠️ Widget is still loading, cannot open yet");
                console.warn(
                  "Debug info - isLoading:",
                  isLoading,
                  "open:",
                  !!open
                );
              }
            }}
          >
            {isLoading ? "Loading..." : "Upload an Image"}
          </Button>
        );
      }}
    </CldUploadWidget>
  );
};
