"use client";

import React, { useState } from "react";
import Image from "next/image";

// Common bio text to be used across components
const bioParagraphs = [
  "Joseph Laoutaris was a passionate and eccentric artist who dedicated his life to painting in isolation. Critically acclaimed in the 1950s, he was invited by Victor Musgrave to exhibit at Gallery One, while Lillian Browse offered him a one-man show at the prestigious Rowland, Browse and Delbanco Gallery in London.",
  "Further invitations followed, most notably from Bryan Robertson during his tenure as director of the Whitechapel Gallery. However, deeply uncomfortable in the company of others and rejecting emerging artistic trends, Joseph shunned all opportunities to promote his work. Instead, he chose to live as a hermit, tirelessly working from within his London apartment.",
  "Joseph cared not for fame, money, or approval. Instead, he focused on refining his technique, alone and in secret, supported by his wife, who tragically took her own life 17 years ago. Joseph Laoutaris passed away in 2022, leaving behind a legacy defined by his unwavering dedication to his art.",
];

// Common interface for all profile components
interface ArtistProfileProps {
  imageUrl: string;
}

// 1. Elegant Split Layout

// 3. Circular Image Profile
export const ArtistProfile: React.FC<ArtistProfileProps> = ({ imageUrl }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full mx-auto p-8 bg-white h-full  ">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative w-48 h-48 rounded-xl overflow-hidden flex-shrink-0 border-4 border-gray-50 shadow-lg">
          <Image
            src={imageUrl}
            alt="Joseph Laoutaris"
            fill
            className="object-cover"
            sizes="192px"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2 text-center md:text-left">
            Joseph Laoutaris
          </h2>
          <p className="text-gray-500 mb-6 text-center md:text-left">
            1920 - 2022
          </p>

          <div className="border-b border-gray-200 mb-4">
            <div className="flex space-x-4">
              {["Biography", "Legacy", "Personal Life"].map((tab, index) => (
                <button
                  key={index}
                  className={`py-2 px-1 border-b-2 transition-colors ${
                    activeTab === index
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
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

          <div className="text-gray-700">{bioParagraphs[activeTab]}</div>
        </div>
      </div>
    </div>
  );
};
