import { UserModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const fieldsParam = searchParams.get("fields");

  const defaultFields = "email";

  const fields = fieldsParam ? fieldsParam.replace(/,/g, " ") : defaultFields;

  try {
    const user = await UserModel.findOne({ email })
      .select(fields)
      //   .sort({ updatedAt: 1 })
      .lean();

    if (!user || user.length === 0) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 404,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      {
        success: false,
        errorCode: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};
