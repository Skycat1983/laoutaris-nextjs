"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { FramedArtworkPreview } from "@/components/shop/frame-preview/FramedArtworkPreview";
import { FramedPrintPreviewModal } from "@/components/shop/frame-preview/FramedPrintPreviewModal";
import { FRAME_PROFILES } from "@/lib/framePreview/frameProfiles";
import { MAT_PROFILES } from "@/lib/framePreview/matProfiles";
import type {
  ArtworkDisplayMetrics,
  FramePreviewBounds,
} from "@/lib/framePreview/types";

type PrototypeArtwork = {
  id: string;
  label: string;
  src: string;
  alt: string;
  metrics: ArtworkDisplayMetrics;
};

type RoomScene = {
  id: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
  hangingZone: {
    leftPercent: number;
    topPercent: number;
    widthPercent: number;
  };
  bounds: FramePreviewBounds;
};

const PROTOTYPE_ARTWORKS = [
  {
    id: "sample-a",
    label: "Sample A",
    src: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713982689/artwork/xexbkermnflwwz3ubdtm.jpg",
    alt: "Sample A artwork frame preview",
    metrics: {
      pixelWidth: 2543,
      pixelHeight: 3504,
    },
  },
  {
    id: "sample-b",
    label: "Sample B",
    src: "https://res.cloudinary.com/dzncmfirr/image/upload/v1739636066/artwork/lxkuzke740r4flfk8rky.jpg",
    alt: "Sample B artwork frame preview",
    metrics: {
      pixelWidth: 3504,
      pixelHeight: 2310,
    },
  },
  {
    id: "sample-c",
    label: "Sample C",
    src: "https://res.cloudinary.com/dzncmfirr/image/upload/v1741015604/artwork/bnd2xppbo7msrnqogys3.jpg",
    alt: "Sample C artwork frame preview",
    metrics: {
      pixelWidth: 2078,
      pixelHeight: 3504,
    },
  },
  {
    id: "sample-d",
    label: "Sample D",
    src: "https://res.cloudinary.com/dzncmfirr/image/upload/v1707470649/art-thumbnails/JRL_w111_crop_so0ecb.jpg",
    alt: "Sample D artwork frame preview",
    metrics: {
      pixelWidth: 1362,
      pixelHeight: 1600,
    },
  },
] as const satisfies readonly PrototypeArtwork[];

const ROOM_SCENES = [
  {
    id: "modern-gallery",
    label: "Modern Gallery",
    imageSrc: "/prototypes/frame-backgrounds/modern-gallery-wall.png",
    imageAlt: "Modern white gallery-style living room wall background",
    hangingZone: {
      leftPercent: 51,
      topPercent: 42,
      widthPercent: 24,
    },
    bounds: {
      maxWidthPx: 255,
      maxHeightPx: 188,
    },
  },
  {
    id: "scandinavian-living",
    label: "Scandinavian Living",
    imageSrc: "/prototypes/frame-backgrounds/scandinavian-living-wall.png",
    imageAlt: "Warm Scandinavian living room wall background",
    hangingZone: {
      leftPercent: 50,
      topPercent: 39,
      widthPercent: 23,
    },
    bounds: {
      maxWidthPx: 245,
      maxHeightPx: 178,
    },
  },
  {
    id: "townhouse-study",
    label: "Townhouse Study",
    imageSrc: "/prototypes/frame-backgrounds/townhouse-study-wall.png",
    imageAlt: "Older townhouse study wall background",
    hangingZone: {
      leftPercent: 52,
      topPercent: 42,
      widthPercent: 22,
    },
    bounds: {
      maxWidthPx: 235,
      maxHeightPx: 172,
    },
  },
  {
    id: "plaster-hallway",
    label: "Plaster Hallway",
    imageSrc: "/prototypes/frame-backgrounds/mediterranean-plaster-wall.png",
    imageAlt: "Mediterranean plaster hallway wall background",
    hangingZone: {
      leftPercent: 50,
      topPercent: 40,
      widthPercent: 22,
    },
    bounds: {
      maxWidthPx: 235,
      maxHeightPx: 172,
    },
  },
] as const satisfies readonly RoomScene[];

const previewBounds = {
  maxWidthPx: 520,
  maxHeightPx: 380,
};

const modalBounds = {
  maxWidthPx: 760,
  maxHeightPx: 560,
};

export const FramePreviewPrototype = () => {
  const [selectedArtworkId, setSelectedArtworkId] = useState<string>(
    PROTOTYPE_ARTWORKS[0].id
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    ROOM_SCENES[0].id
  );
  const [requestedRoomId, setRequestedRoomId] = useState<string>(
    ROOM_SCENES[0].id
  );
  const [loadedRoomIds, setLoadedRoomIds] = useState<Set<string>>(
    () => new Set([ROOM_SCENES[0].id])
  );
  const [selectedFrameProfileId, setSelectedFrameProfileId] = useState<string>(
    FRAME_PROFILES[0].id
  );
  const [selectedMatProfileId, setSelectedMatProfileId] = useState<string>(
    MAT_PROFILES[1].id
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedArtwork = useMemo(() => {
    return (
      PROTOTYPE_ARTWORKS.find((artwork) => artwork.id === selectedArtworkId) ??
      PROTOTYPE_ARTWORKS[0]
    );
  }, [selectedArtworkId]);
  const selectedRoom = useMemo(() => {
    return (
      ROOM_SCENES.find((room) => room.id === selectedRoomId) ?? ROOM_SCENES[0]
    );
  }, [selectedRoomId]);
  const requestedRoom = useMemo(() => {
    return (
      ROOM_SCENES.find((room) => room.id === requestedRoomId) ?? ROOM_SCENES[0]
    );
  }, [requestedRoomId]);
  const selectedFrameProfile = useMemo(() => {
    return (
      FRAME_PROFILES.find((profile) => profile.id === selectedFrameProfileId) ??
      FRAME_PROFILES[0]
    );
  }, [selectedFrameProfileId]);
  const matProfile = useMemo(() => {
    return (
      MAT_PROFILES.find((profile) => profile.id === selectedMatProfileId) ??
      MAT_PROFILES[1]
    );
  }, [selectedMatProfileId]);
  const isRoomChangePending = requestedRoom.id !== selectedRoom.id;

  const commitLoadedRoom = (roomId: string) => {
    setLoadedRoomIds((currentRoomIds) => {
      if (currentRoomIds.has(roomId)) {
        return currentRoomIds;
      }

      const nextRoomIds = new Set(currentRoomIds);
      nextRoomIds.add(roomId);

      return nextRoomIds;
    });
    setSelectedRoomId(roomId);
  };

  const handleRoomSelect = (roomId: string) => {
    setRequestedRoomId(roomId);

    if (loadedRoomIds.has(roomId)) {
      setSelectedRoomId(roomId);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
      <section
        className="grid min-h-[calc(100vh-4rem)] gap-8 lg:grid-cols-[minmax(0,1fr),360px]"
        aria-labelledby="frame-prototype-heading"
      >
        <div className="flex min-h-[520px] flex-col justify-center gap-5">
          <div
            className="relative aspect-[1586/992] w-full overflow-hidden bg-stone-200 shadow-sm"
            data-testid="prototype-frame-room-scene"
            data-room-transitioning={isRoomChangePending ? "true" : "false"}
          >
            <Image
              src={selectedRoom.imageSrc}
              alt={selectedRoom.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) calc(100vw - 460px), 100vw"
              className="object-cover"
            />
            {isRoomChangePending ? (
              <Image
                key={requestedRoom.id}
                src={requestedRoom.imageSrc}
                alt=""
                width={32}
                height={20}
                aria-hidden="true"
                data-testid="prototype-frame-room-preloader"
                onLoad={() => commitLoadedRoom(requestedRoom.id)}
                className="pointer-events-none absolute left-0 top-0 z-0 h-px w-px opacity-0"
              />
            ) : null}
            <div
              className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              data-testid="prototype-frame-room-hanging-zone"
              style={{
                left: `${selectedRoom.hangingZone.leftPercent}%`,
                top: `${selectedRoom.hangingZone.topPercent}%`,
                width: `${selectedRoom.hangingZone.widthPercent}%`,
              }}
            >
              <div className="relative flex w-full items-center justify-center drop-shadow-[0_18px_22px_rgba(0,0,0,0.28)]">
                <FramedArtworkPreview
                  artwork={selectedArtwork}
                  frameProfile={selectedFrameProfile}
                  matProfile={matProfile}
                  bounds={selectedRoom.bounds}
                  renderMode="rails"
                  priority
                  className="flex justify-center"
                />
              </div>
            </div>
            <span
              aria-hidden="true"
              data-testid="prototype-frame-room-loading-mask"
              className={`pointer-events-none absolute inset-0 z-20 bg-white/10 backdrop-blur-[1px] transition-opacity duration-300 ${
                isRoomChangePending ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          <div className="flex items-center justify-between gap-4 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
            <span>{selectedRoom.label}</span>
            <span>Room-scale wall preview</span>
          </div>

          <div className="flex items-center justify-center bg-white p-5 shadow-sm">
            <FramedArtworkPreview
              artwork={selectedArtwork}
              frameProfile={selectedFrameProfile}
              matProfile={matProfile}
              bounds={previewBounds}
              renderMode="rails"
              className="flex justify-center"
            />
          </div>
        </div>

        <aside className="flex flex-col justify-center gap-8">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-gray-500">
              Prototype
            </p>
            <h2
              id="frame-prototype-heading"
              className="text-3xl font-semibold tracking-normal"
            >
              Frame preview
            </h2>
          </div>

          <div className="space-y-3" aria-label="Artwork samples">
            <p className="text-sm font-medium text-gray-700">Artwork sample</p>
            <div className="grid grid-cols-2 gap-2">
              {PROTOTYPE_ARTWORKS.map((artwork) => (
                <button
                  key={artwork.id}
                  type="button"
                  aria-pressed={artwork.id === selectedArtwork.id}
                  className={`border px-3 py-3 text-left text-sm transition ${
                    artwork.id === selectedArtwork.id
                      ? "border-gray-950 bg-gray-950 text-white"
                      : "border-gray-300 bg-white text-gray-900 hover:border-gray-800"
                  }`}
                  onClick={() => setSelectedArtworkId(artwork.id)}
                >
                  {artwork.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3" aria-label="Room background samples">
            <p className="text-sm font-medium text-gray-700">Room background</p>
            <div className="grid grid-cols-1 gap-2">
              {ROOM_SCENES.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  aria-pressed={room.id === requestedRoom.id}
                  className={`flex items-center gap-3 border px-3 py-3 text-left text-sm transition ${
                    room.id === requestedRoom.id
                      ? "border-gray-950 bg-white text-gray-950 ring-1 ring-gray-950"
                      : "border-gray-300 bg-white text-gray-900 hover:border-gray-800"
                  }`}
                  onClick={() => handleRoomSelect(room.id)}
                >
                  <span
                    aria-hidden="true"
                    className="h-10 w-14 flex-none overflow-hidden bg-stone-200"
                    style={{
                      backgroundImage: `url(${room.imageSrc})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  />
                  {room.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3" aria-label="Frame material samples">
            <p className="text-sm font-medium text-gray-700">Frame material</p>
            <div className="grid grid-cols-1 gap-2">
              {FRAME_PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  aria-pressed={profile.id === selectedFrameProfile.id}
                  className={`flex items-center gap-3 border px-3 py-3 text-left text-sm transition ${
                    profile.id === selectedFrameProfile.id
                      ? "border-gray-950 bg-white text-gray-950 ring-1 ring-gray-950"
                      : "border-gray-300 bg-white text-gray-900 hover:border-gray-800"
                  }`}
                  onClick={() => setSelectedFrameProfileId(profile.id)}
                >
                  <span
                    aria-hidden="true"
                    className="h-5 w-5 rounded-full border border-black/10"
                    style={{ background: profile.previewStyle.outerColor }}
                  />
                  {profile.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3" aria-label="Mat margin presets">
            <p className="text-sm font-medium text-gray-700">Mat margin</p>
            <div className="grid grid-cols-1 gap-2">
              {MAT_PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  aria-pressed={profile.id === matProfile.id}
                  className={`border px-3 py-3 text-left text-sm transition ${
                    profile.id === matProfile.id
                      ? "border-gray-950 bg-white text-gray-950 ring-1 ring-gray-950"
                      : "border-gray-300 bg-white text-gray-900 hover:border-gray-800"
                  }`}
                  onClick={() => setSelectedMatProfileId(profile.id)}
                >
                  {profile.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="w-full bg-gray-950 px-5 py-4 text-center text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
            onClick={() => setIsModalOpen(true)}
          >
            Open modal preview
          </button>
        </aside>
      </section>

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Sample comparison"
      >
        {PROTOTYPE_ARTWORKS.map((artwork) => (
          <div key={artwork.id} className="bg-white p-4 shadow-sm">
            <FramedArtworkPreview
              artwork={artwork}
              frameProfile={selectedFrameProfile}
              matProfile={matProfile}
              bounds={{ maxWidthPx: 320, maxHeightPx: 240 }}
              renderMode="rails"
              className="flex justify-center"
            />
            <p className="mt-3 text-center text-sm font-medium text-gray-700">
              {artwork.label}
            </p>
          </div>
        ))}
      </section>

      <FramedPrintPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        artwork={selectedArtwork}
        frameProfiles={FRAME_PROFILES}
        initialFrameProfileId={selectedFrameProfile.id}
        matProfile={matProfile}
        bounds={modalBounds}
        renderMode="rails"
        title="Frame Preview Prototype"
      />
    </div>
  );
};
