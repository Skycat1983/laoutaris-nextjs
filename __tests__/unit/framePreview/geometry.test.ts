import { readFileSync, readdirSync } from "fs";
import path from "path";
import {
  calculateFramePreviewGeometry,
  getFrameScaleMode,
} from "@/lib/framePreview/geometry";
import {
  DEFAULT_FRAME_PROFILE_ID,
  FRAME_PROFILES,
  getFrameProfileById,
} from "@/lib/framePreview/frameProfiles";
import {
  DEFAULT_MAT_PROFILE_ID,
  getMatProfileById,
  MAT_PROFILES,
} from "@/lib/framePreview/matProfiles";
import type {
  ArtworkDisplayMetrics,
  FrameProfile,
  MatProfile,
} from "@/lib/framePreview/types";

const testFrameProfile: FrameProfile = {
  id: "test-frame",
  label: "Test Frame",
  material: "black-wood",
  previewStyle: {
    outerColor: "#111111",
  },
  fallbackFrameRatio: 0.05,
  minFramePx: 12,
  maxFramePx: 40,
  widthCm: 4,
};

const testMatProfile: MatProfile = {
  id: "test-mat",
  label: "Test Mat",
  color: "#f5f0e8",
  fallbackMatRatio: 0.1,
  minMatPx: 18,
  maxMatPx: 80,
  matWidthCm: 5,
};

const noMatProfile = getMatProfileById(DEFAULT_MAT_PROFILE_ID);

if (!noMatProfile) {
  throw new Error("Default mat profile is missing");
}

const calculate = (
  artwork: ArtworkDisplayMetrics,
  frameProfile = testFrameProfile,
  matProfile: MatProfile = noMatProfile
) =>
  calculateFramePreviewGeometry({
    artwork,
    frameProfile,
    matProfile,
    bounds: {
      maxWidthPx: 800,
      maxHeightPx: 600,
    },
  });

describe("frame preview profile catalogs", () => {
  it("exposes stable default frame and mat profiles", () => {
    expect(getFrameProfileById(DEFAULT_FRAME_PROFILE_ID)?.id).toBe(
      DEFAULT_FRAME_PROFILE_ID
    );
    expect(getMatProfileById(DEFAULT_MAT_PROFILE_ID)?.id).toBe(
      DEFAULT_MAT_PROFILE_ID
    );
  });

  it("keeps frame profile IDs unique and physically prepared", () => {
    const ids = FRAME_PROFILES.map((profile) => profile.id);

    expect(new Set(ids).size).toBe(ids.length);

    for (const profile of FRAME_PROFILES) {
      expect(profile.id).toMatch(/^[a-z0-9-]+$/);
      expect(profile.label).toBeTruthy();
      expect(profile.previewStyle.outerColor).toMatch(/^#[0-9a-f]{6}$/i);
      expect(profile.fallbackFrameRatio).toBeGreaterThan(0);
      expect(profile.fallbackFrameRatio).toBeLessThan(1);
      expect(profile.minFramePx).toBeGreaterThanOrEqual(0);
      expect(profile.maxFramePx).toBeGreaterThanOrEqual(profile.minFramePx);
      expect(profile.widthCm).toBeGreaterThan(0);
    }
  });

  it("keeps mat profile IDs unique and includes a no-mat default", () => {
    const ids = MAT_PROFILES.map((profile) => profile.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(noMatProfile).toMatchObject({
      fallbackMatRatio: 0,
      minMatPx: 0,
      maxMatPx: 0,
      matWidthCm: 0,
    });
  });
});

describe("calculateFramePreviewGeometry", () => {
  it("fits portrait artwork into the requested preview bounds", () => {
    const geometry = calculate({
      pixelWidth: 1200,
      pixelHeight: 1800,
    });

    expect(geometry.scaleMode).toBe("relativePreview");
    expect(geometry.artwork.heightPx).toBeGreaterThan(geometry.artwork.widthPx);
    expect(geometry.outer.widthPx).toBeLessThanOrEqual(800);
    expect(geometry.outer.heightPx).toBeLessThanOrEqual(600);
    expect(geometry.artworkAspectRatio).toBeCloseTo(0.667, 3);
  });

  it("fits landscape artwork into the requested preview bounds", () => {
    const geometry = calculate({
      pixelWidth: 1800,
      pixelHeight: 1200,
    });

    expect(geometry.scaleMode).toBe("relativePreview");
    expect(geometry.artwork.widthPx).toBeGreaterThan(geometry.artwork.heightPx);
    expect(geometry.outer.widthPx).toBeLessThanOrEqual(800);
    expect(geometry.outer.heightPx).toBeLessThanOrEqual(600);
    expect(geometry.artworkAspectRatio).toBeCloseTo(1.5, 3);
  });

  it("fits square artwork without distorting the artwork ratio", () => {
    const geometry = calculate({
      pixelWidth: 1000,
      pixelHeight: 1000,
    });

    expect(geometry.artwork.widthPx).toBeCloseTo(geometry.artwork.heightPx, 3);
    expect(geometry.outer.widthPx).toBeCloseTo(geometry.outer.heightPx, 3);
    expect(geometry.outer.widthPx).toBeLessThanOrEqual(800);
    expect(geometry.outer.heightPx).toBeLessThanOrEqual(600);
  });

  it("keeps an extreme aspect ratio within bounds", () => {
    const geometry = calculate({
      pixelWidth: 4000,
      pixelHeight: 700,
    });

    expect(geometry.artwork.widthPx).toBeGreaterThan(
      geometry.artwork.heightPx * 4
    );
    expect(geometry.outer.widthPx).toBeLessThanOrEqual(800);
    expect(geometry.outer.heightPx).toBeLessThanOrEqual(600);
  });

  it("clamps relative frame thickness to configured minimum and maximum values", () => {
    const smallGeometry = calculateFramePreviewGeometry({
      artwork: {
        pixelWidth: 1000,
        pixelHeight: 1000,
      },
      frameProfile: {
        ...testFrameProfile,
        fallbackFrameRatio: 0.01,
        minFramePx: 16,
        maxFramePx: 40,
      },
      matProfile: noMatProfile,
      bounds: {
        maxWidthPx: 280,
        maxHeightPx: 280,
      },
    });
    const largeGeometry = calculateFramePreviewGeometry({
      artwork: {
        pixelWidth: 1000,
        pixelHeight: 1000,
      },
      frameProfile: {
        ...testFrameProfile,
        fallbackFrameRatio: 0.5,
        minFramePx: 8,
        maxFramePx: 32,
      },
      matProfile: noMatProfile,
      bounds: {
        maxWidthPx: 900,
        maxHeightPx: 900,
      },
    });

    expect(smallGeometry.frame.widthPx).toBe(16);
    expect(largeGeometry.frame.widthPx).toBe(32);
  });

  it("adds optional mat thickness around the artwork before the frame", () => {
    const noMatGeometry = calculate({
      pixelWidth: 1000,
      pixelHeight: 1000,
    });
    const matGeometry = calculate(
      {
        pixelWidth: 1000,
        pixelHeight: 1000,
      },
      testFrameProfile,
      testMatProfile
    );

    expect(noMatGeometry.mat.widthPx).toBe(0);
    expect(matGeometry.mat.widthPx).toBeGreaterThan(0);
    expect(matGeometry.artwork.widthPx).toBeLessThan(
      noMatGeometry.artwork.widthPx
    );
    expect(matGeometry.outer.widthPx).toBeLessThanOrEqual(800);
    expect(matGeometry.outer.heightPx).toBeLessThanOrEqual(600);
  });

  it("uses physical scale only when complete print dimensions are available", () => {
    const geometry = calculate(
      {
        pixelWidth: 1000,
        pixelHeight: 1000,
        physicalPrintWidthCm: 40,
        physicalPrintHeightCm: 40,
      },
      testFrameProfile,
      testMatProfile
    );

    expect(geometry.scaleMode).toBe("physicalScalePreview");
    expect(geometry.frame.widthPx / geometry.artwork.widthPx).toBeCloseTo(
      4 / 40,
      3
    );
    expect(geometry.mat.widthPx / geometry.artwork.widthPx).toBeCloseTo(
      5 / 40,
      3
    );
  });

  it("keeps relative scale when only original artwork dimensions are present", () => {
    const geometry = calculate({
      pixelWidth: 1000,
      pixelHeight: 1000,
      physicalArtworkWidthCm: 100,
      physicalArtworkHeightCm: 100,
    });

    expect(geometry.scaleMode).toBe("relativePreview");
  });

  it("keeps relative scale when print dimensions do not match the image ratio", () => {
    const geometry = calculate({
      pixelWidth: 1600,
      pixelHeight: 1000,
      physicalPrintWidthCm: 40,
      physicalPrintHeightCm: 40,
    });

    expect(geometry.scaleMode).toBe("relativePreview");
  });

  it("throws for invalid artwork metrics, profile values, and bounds", () => {
    expect(() =>
      calculate({
        pixelWidth: 0,
        pixelHeight: 1000,
      })
    ).toThrow("artwork.pixelWidth");

    expect(() =>
      calculateFramePreviewGeometry({
        artwork: {
          pixelWidth: 1000,
          pixelHeight: 1000,
        },
        frameProfile: {
          ...testFrameProfile,
          minFramePx: 40,
          maxFramePx: 20,
        },
        matProfile: noMatProfile,
        bounds: {
          maxWidthPx: 800,
          maxHeightPx: 600,
        },
      })
    ).toThrow("frameProfile");

    expect(() =>
      calculateFramePreviewGeometry({
        artwork: {
          pixelWidth: 1000,
          pixelHeight: 1000,
        },
        frameProfile: testFrameProfile,
        matProfile: noMatProfile,
        bounds: {
          maxWidthPx: 0,
          maxHeightPx: 600,
        },
      })
    ).toThrow("bounds.maxWidthPx");
  });
});

describe("getFrameScaleMode", () => {
  it("reports relative preview mode when physical profile widths are missing", () => {
    expect(
      getFrameScaleMode(
        {
          pixelWidth: 1000,
          pixelHeight: 1000,
          physicalPrintWidthCm: 40,
          physicalPrintHeightCm: 40,
        },
        {
          ...testFrameProfile,
          widthCm: undefined,
        },
        noMatProfile
      )
    ).toBe("relativePreview");
  });
});

describe("frame preview source hygiene", () => {
  it("keeps first-phase frame preview helpers pure", () => {
    const sourceDir = path.join(process.cwd(), "src/lib/framePreview");
    const source = readdirSync(sourceDir)
      .filter((filename) => filename.endsWith(".ts"))
      .map((filename) => readFileSync(path.join(sourceDir, filename), "utf8"))
      .join("\n");

    expect(source).not.toMatch(/from\s+["'](?:react|next|mongoose|mongodb)/);
    expect(source).not.toMatch(/@\/lib\/api\/shopify/);
    expect(source).not.toMatch(/@\/lib\/data\/(?:models|services)/);
    expect(source).not.toMatch(/@\/lib\/db/);
    expect(source).not.toMatch(/\bwindow\b|\bdocument\b/);
  });
});
