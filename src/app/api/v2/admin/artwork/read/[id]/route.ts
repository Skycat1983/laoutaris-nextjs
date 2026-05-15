import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { ArtworkModel } from "@/lib/data/models";
import { ReadArtworkResult } from "@/lib/api/admin/read/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  adminReadInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/read/routeValidation";
import { AdminArtworkTransformations } from "@/lib/data/types";
import { transformArtwork } from "@/lib/transforms";
import { ArtworkFrontend } from "@/lib/data/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadArtworkResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { id } = params;
  if (!isValidObjectIdParam(id)) {
    return adminReadInvalidIdResponse("artwork", "Invalid artwork ID");
  }

  try {
    await dbConnect();

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

    const frontendArtwork: ArtworkFrontend =
      transformArtwork.toFrontend(leanArtwork);

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
