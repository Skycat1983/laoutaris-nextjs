import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { UserModel } from "@/lib/server/models";

// ! UNUSED
// TODO: maybe this should be middleware? we could add it to protected routes?
export const GET = async (request: Request): Promise<NextResponse> => {
  try {
    // const { searchParams } = new URL(request.url);
    // const username = searchParams.get("username");

    // Get the session
    const session = await getServerSession(authOptions);

    // If there is no session or user is not logged in, return an error
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 400,
          message: "User not logged in",
        },
        { status: 400 }
      );
    }

    const { name: username, email } = session.user;

    // Try to find the user in the database
    let user = await UserModel.findOne({ username });

    // If the user doesn't exist, create a new user
    if (!user) {
      console.log("Logged-in user not registered");
      console.log("Registering...");

      const newUser = new UserModel({
        username,
        email,
      });

      user = await newUser.save();
    }

    // Return the userId
    return NextResponse.json(
      {
        success: true,
        userId: user._id,
      },
      { status: 200 }
    );
  } catch (error) {
    // Catch any errors and return an error response
    console.error("Error in GET route:", error);

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
