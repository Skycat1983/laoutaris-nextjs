import { UserModel } from "@/lib/data/models";
import { getUserIdFromSession } from "@/lib/old_code/user/session/getUserIdFromSession";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromSession();

  try {
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      });
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch user",
    });
  }
}
