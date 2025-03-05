import { CollectionModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { CreateCollectionResult } from "@/lib/api/admin/create/fetchers";
import { isAdmin } from "@/lib/session/isAdmin";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

export async function POST(
  request: Request
): Promise<RouteResponse<CreateCollectionResult>> {
  const hasPermission = await isAdmin();
  const userId = await getUserIdFromSession();

  if (!hasPermission || !userId) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
        error: "Unauthorized",
      } satisfies ApiErrorResponse,
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const slug = slugify(body.title, { lower: true });

    const collectionData = {
      ...body,
      slug,
      author: userId,
    };

    console.log("collectionData", collectionData);

    const collection = new CollectionModel(collectionData);
    await collection.save();

    return NextResponse.json(
      { success: true, data: collection } satisfies CreateCollectionResult,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        error: "Failed to create collection",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
