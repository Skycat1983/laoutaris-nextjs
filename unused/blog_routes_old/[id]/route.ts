import { BlogModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  console.log("in route");
  const response = await BlogModel.findById(id).lean();
  if (!response) {
    return NextResponse.json(
      {
        success: false,
        errorCode: 404,
        message: "Blog entry not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: response });
};
