"use server";

import { UserModel } from "../data/models";
import { getServerSession } from "next-auth";
import { createUserFromSession } from "./createUserFromSession";
import { authOptions } from "@/lib/config/authOptions";

//! in use

type UserIdentifier = string | null;

export const getUserIdFromSession = async (): Promise<UserIdentifier> => {
  const session = await getServerSession(authOptions);

  if (session && session.user && session.user.name) {
    const username = session.user.name;
    const email = session.user.email;
    // console.log("session.user", session.user);

    const user = await UserModel.findOne({ username });
    console.log("user", user);

    if (user) {
      return user._id.toString();
    } else {
      const userId =
        email && username ? await createUserFromSession(username, email) : null;
      return userId;
    }
  } else {
    return null;
  }
};

// export const getUserIdFromSession = async (
//   req?: Request
// ): Promise<UserIdentifier> => {
//   // For Postman testing in development environment
//   if (process.env.NODE_ENV === "development" && req) {
//     const testUserId = req.headers.get("X-Test-User-Id");
//     if (testUserId) {
//       console.log("Using test user ID:", testUserId);
//       return testUserId;
//     }
//     const testAdminId = req.headers.get("X-Test-Admin-Id");
//     if (testAdminId) {
//       console.log("Using test admin ID:", testAdminId);
//       return testAdminId;
//     }
//   }

//   const session = await getServerSession(authOptions);

//   if (session && session.user && session.user.name) {
//     const username = session.user.name;
//     const email = session.user.email;
//     // console.log("session.user", session.user);

//     const user = await UserModel.findOne({ username });

//     if (user) {
//       return user._id.toString();
//     } else {
//       const userId =
//         email && username ? await createUserFromSession(username, email) : null;
//       return userId;
//     }
//   } else {
//     return null;
//   }
// };
