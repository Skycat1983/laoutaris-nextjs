import Image from "next/image";
import { FramedArtworkPreview } from "./FramedArtworkPreview";
import { cn } from "@/lib/utils";
import {
  DEFAULT_ROOM_SHADOW_SETTINGS,
  ROOM_HANGING_ZONE,
  ROOM_PREVIEW_SCALE,
  getRoomShadowStyle,
  scaleFrameProfileForRoom,
  scaleMatProfileForRoom,
  type FramePreviewRoomScene,
  type RoomShadowSettings,
} from "@/lib/framePreview/roomScenes";
import type {
  ArtworkDisplayMetrics,
  FramePreviewBounds,
  FrameProfile,
  MatProfile,
} from "@/lib/framePreview/types";

type RoomFramedArtwork = {
  src: string;
  alt: string;
  metrics: ArtworkDisplayMetrics;
};

export type RoomFramedArtworkPreviewProps = {
  artwork: RoomFramedArtwork;
  roomScene: FramePreviewRoomScene;
  frameProfile: FrameProfile;
  matProfile: MatProfile;
  bounds: FramePreviewBounds;
  profileScale?: number;
  shadowSettings?: RoomShadowSettings;
  priority?: boolean;
  unoptimized?: boolean;
  imageSizes?: string;
  className?: string;
  testId?: string;
};

export const RoomFramedArtworkPreview = ({
  artwork,
  roomScene,
  frameProfile,
  matProfile,
  bounds,
  profileScale = ROOM_PREVIEW_SCALE,
  shadowSettings = DEFAULT_ROOM_SHADOW_SETTINGS,
  priority = false,
  unoptimized = false,
  imageSizes = "100vw",
  className,
  testId,
}: RoomFramedArtworkPreviewProps) => {
  const roomFrameProfile = scaleFrameProfileForRoom(frameProfile, profileScale);
  const roomMatProfile = scaleMatProfileForRoom(matProfile, profileScale);
  const roomShadowStyles = getRoomShadowStyle(shadowSettings);

  return (
    <div
      className={cn(
        "relative aspect-[1586/992] w-full overflow-hidden bg-stone-100",
        className
      )}
      data-testid={testId}
    >
      <Image
        src={roomScene.imageSrc}
        alt={roomScene.imageAlt}
        fill
        priority={priority ? true : undefined}
        sizes={imageSizes}
        className="object-cover"
      />
      <div
        className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        data-testid="room-framed-preview-hanging-zone"
        style={{
          left: `${ROOM_HANGING_ZONE.leftPercent}%`,
          top: `${ROOM_HANGING_ZONE.topPercent}%`,
          width: `${ROOM_HANGING_ZONE.widthPercent}%`,
        }}
      >
        <div
          className="relative inline-flex items-center justify-center"
          data-testid="room-framed-preview-shadow"
          style={roomShadowStyles.frameShadow}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-full z-0 origin-left"
            data-shadow-direction="south-east"
            data-testid="room-framed-preview-corner-shadow-bottom-left"
            style={roomShadowStyles.cornerShadow}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-full top-0 z-0 origin-left"
            data-shadow-direction="south-east"
            data-testid="room-framed-preview-corner-shadow-top-right"
            style={roomShadowStyles.cornerShadow}
          />
          <FramedArtworkPreview
            artwork={artwork}
            frameProfile={roomFrameProfile}
            matProfile={roomMatProfile}
            bounds={bounds}
            renderMode="rails"
            sizingMode="fixedArtwork"
            priority={priority}
            unoptimized={unoptimized}
            className="relative z-10 flex justify-center"
          />
        </div>
      </div>
    </div>
  );
};
