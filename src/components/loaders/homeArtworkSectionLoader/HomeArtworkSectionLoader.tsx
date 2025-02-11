"use server";

import { delay } from "@/utils/debug";
import HomeArtworkSection from "../../contentSections/HomeArtworkSection";

export async function HomeArtworkSectionLoader() {
  await delay(1000);
  const artworks = [
    {
      label: "Latest",
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361219/artwork/sp1r7xxdcphbno8f8b8n.jpg",
    },
    {
      label: "Featured",
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713982473/artwork/i5vhhp7td38kmzr9mlqu.jpg",
    },
    {
      label: "Popular",
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713359591/artwork/x4h3u351cpxrlxo8bkib.jpg",
    },
    {
      label: "Semi-Abstract",
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361367/artwork/oipyhryrov7znzgddacj.jpg",
    },
    {
      label: "Abstract",
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361331/artwork/k3xip7zky2hig2fucx3s.jpg",
    },
    {
      label: "Figurative",
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713982410/artwork/i9aejlyxcchyvamyhrvf.jpg",
    },
  ];
  return <HomeArtworkSection artworks={artworks} />;
}
