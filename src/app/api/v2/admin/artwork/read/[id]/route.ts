import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { ArtworkModel } from "@/lib/data/models";
import { ReadArtworkResult } from "@/lib/api/admin/read/fetchers";
import { isAdmin } from "@/lib/session/isAdmin";
import { AdminArtworkTransformations } from "@/lib/data/types";
import { transformAdminArtwork } from "@/lib/transforms/transformAdmin";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadArtworkResult>> {
  const hasPermission = await isAdmin();
  if (!hasPermission) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
        error: "Unauthorized",
      } satisfies ApiErrorResponse,
      { status: 401 }
    );
  }
  const { id } = params;

  try {
    const leanArtwork = await ArtworkModel.findById(id)
      .lean<AdminArtworkTransformations["Lean"]>()
      .exec();

    if (!leanArtwork) {
      return NextResponse.json(
        {
          success: false,
          error: "Artwork not found",
        } satisfies ApiErrorResponse,
        {
          status: 404,
        }
      );
    }

    const frontendArtwork: AdminArtworkTransformations["Frontend"] =
      transformAdminArtwork(leanArtwork);

    return NextResponse.json({
      success: true,
      data: frontendArtwork,
    } satisfies ReadArtworkResult);
  } catch (error) {
    console.error("Error reading artwork:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to read artwork",
      } satisfies ApiErrorResponse,
      {
        status: 500,
      }
    );
  }
}
