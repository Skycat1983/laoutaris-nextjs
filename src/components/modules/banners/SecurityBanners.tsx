"use client";

import React from "react";
import {
  Archive,
  BookOpen,
  ExternalLink,
  FileText,
  HeartHandshake,
  Mail,
  UserRound,
} from "lucide-react";

export const SecurityBannerWhite = () => {
  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-5 gap-8">
          <div className="flex flex-col items-center text-center">
            <Archive className="w-8 h-8 mb-4 text-gray-700" />
            <h3 className="text-sm font-medium mb-2">Archive Records</h3>
            <p className="text-xs text-gray-600">Artwork details and images</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <UserRound className="w-8 h-8 mb-4 text-gray-700" />
            <h3 className="text-sm font-medium mb-2">Studio Contact</h3>
            <p className="text-xs text-gray-600">Reach us by enquiry form</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <ExternalLink className="w-8 h-8 mb-4 text-gray-700" />
            <h3 className="text-sm font-medium mb-2">Shopify Links</h3>
            <p className="text-xs text-gray-600">Hosted pages when available</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FileText className="w-8 h-8 mb-4 text-gray-700" />
            <h3 className="text-sm font-medium mb-2">Artwork Enquiries</h3>
            <p className="text-xs text-gray-600">Product context is preserved</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <BookOpen className="w-8 h-8 mb-4 text-gray-700" />
            <h3 className="text-sm font-medium mb-2">Public Catalogue</h3>
            <p className="text-xs text-gray-600">Browse artworks and articles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SecurityBannerBlack = () => {
  return (
    <div className="w-full bg-neutral-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-5 gap-8">
          {[
            {
              icon: <Archive />,
              title: "Archive Browsing",
              desc: "Public artwork records",
            },
            {
              icon: <FileText />,
              title: "Artwork Context",
              desc: "Archive details",
            },
            {
              icon: <UserRound />,
              title: "Studio Contact",
              desc: "Direct enquiries",
            },
            {
              icon: <ExternalLink />,
              title: "Shopify Links",
              desc: "Hosted pages when available",
            },
            {
              icon: <HeartHandshake />,
              title: "Archive Care",
              desc: "Maintained catalogue",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                {React.cloneElement(item.icon as React.ReactElement, {
                  className:
                    "w-6 h-6 text-white/80 group-hover:text-white transition-colors",
                })}
              </div>
              <h3 className="text-sm font-medium mb-2 group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SecurityBannerGrey = () => {
  return (
    <div className="w-full bg-neutral-200 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-5 gap-12">
          {[
            {
              icon: <Archive />,
              title: "Archive Platform",
              desc: "Public artwork records",
            },
            {
              icon: <BookOpen />,
              title: "Artist Archive",
              desc: "Joseph Laoutaris works",
            },
            {
              icon: <ExternalLink />,
              title: "Shopify Links",
              desc: "Hosted pages when available",
            },
            {
              icon: <Mail />,
              title: "Direct Contact",
              desc: "Enquiry form available",
            },
            {
              icon: <FileText />,
              title: "Catalogue Access",
              desc: "Artworks and articles",
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-whitish flex items-center justify-center mb-4">
                {React.cloneElement(item.icon as React.ReactElement, {
                  className: "w-7 h-7 text-black",
                })}
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
