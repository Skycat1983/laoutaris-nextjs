"use client";

import React, { useState } from "react";
import Image from "next/image";

// Interface for collection info props
interface CollectionInfoProps {
  title?: string;
  subtitle?: string;
  artworkCount?: number;
  imageUrl?: string;
}

// Default props for demonstration
const defaultProps: CollectionInfoProps = {
  title: "Solitude and Shadows",
  subtitle: "A retrospective of Joseph Laoutaris's most influential works.",
  artworkCount: 24,
  imageUrl:
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1739636813/artwork/rgdz07hgljrjdj3ne7mv.jpg",
};

// 2. Minimal Collection Stats
export const MinimalCollectionStats: React.FC<CollectionInfoProps> = (
  props
) => {
  const { title, subtitle, artworkCount } = { ...defaultProps, ...props };

  return (
    <div className="bg-gray-50 p-5 rounded-md h-full">
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{subtitle}</p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-white rounded-md shadow-sm">
          <span className="block text-2xl font-light text-gray-800">
            {artworkCount}
          </span>
          <span className="text-xs text-gray-500">Artworks</span>
        </div>
        <div className="text-center p-3 bg-white rounded-md shadow-sm">
          <span className="block text-2xl font-light text-gray-800">1950s</span>
          <span className="text-xs text-gray-500">Period</span>
        </div>
        <div className="text-center p-3 bg-white rounded-md shadow-sm">
          <span className="block text-2xl font-light text-gray-800">4</span>
          <span className="text-xs text-gray-500">Exhibitions</span>
        </div>
      </div>

      <button className="w-full py-2 text-center text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
        Explore Collection
      </button>
    </div>
  );
};

// 3. Tabbed Collection Info
export const TabbedCollectionInfo: React.FC<CollectionInfoProps> = (props) => {
  const { title, subtitle, artworkCount } = { ...defaultProps, ...props };
  const [activeTab, setActiveTab] = useState(0);

  const tabContent = [
    <div key="overview" className="py-3">
      <p className="text-sm text-gray-700 mb-3">{subtitle}</p>
      <p className="text-sm text-gray-700">
        This collection showcases the evolution of Laoutaris's unique style,
        characterized by bold brushstrokes and muted color palettes that evoke a
        profound sense of isolation.
      </p>
    </div>,
    <div key="details" className="py-3">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Number of Artworks:</span>
          <span className="font-medium">{artworkCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Time Period:</span>
          <span className="font-medium">1950-1980</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Medium:</span>
          <span className="font-medium">Oil on Canvas</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Exhibition History:</span>
          <span className="font-medium">4 Exhibitions</span>
        </div>
      </div>
    </div>,
    <div key="curator" className="py-3">
      <p className="text-sm text-gray-700 mb-3">
        "This collection represents the pinnacle of Laoutaris's exploration of
        human solitude. Each piece invites the viewer to experience the artist's
        profound isolation."
      </p>
      <p className="text-sm font-medium">— Eleanor Winters, Curator</p>
    </div>,
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden p-8 h-full">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium">{title}</h3>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex">
          {["Overview", "Details", "Curator's Note"].map((tab, index) => (
            <button
              key={index}
              className={`py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === index
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(index)}
              aria-selected={activeTab === index}
              role="tab"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">{tabContent[activeTab]}</div>
    </div>
  );
};
