import { authOptions } from "@/lib/config/authOptions";
import { CollectionModel } from "@/lib/data/models";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const slug = slugify(body.title, { lower: true });

    const collectionData = {
      ...body,
      slug,
      author: session.user.id,
    };

    console.log("collectionData", collectionData);

    const collection = new CollectionModel(collectionData);
    await collection.save();

    return NextResponse.json(
      { success: true, data: collection },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create collection" },
      { status: 500 }
    );
  }
}
