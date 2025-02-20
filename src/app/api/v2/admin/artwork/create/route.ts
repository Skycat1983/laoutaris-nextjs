import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // const result = await createArtwork(body);
    // return NextResponse.json(result);
    console.log("body in create artwork route :>> ", body);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create artwork" },
      { status: 500 }
    );
  }
}
