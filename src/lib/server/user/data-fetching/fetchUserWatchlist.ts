import { headers } from "next/headers";

export async function fetchUserWatchlist<T>(
  userKey: string,
  userValue: string,
  userFields?: string[],
  artworkFields?: string[]
): Promise<ApiResponse<T>> {
  const queryParams = new URLSearchParams({
    userKey,
    userValue,
  });

  if (userFields && userFields.length > 0) {
    queryParams.append("userFields", userFields.join(","));
  }

  if (artworkFields && artworkFields.length > 0) {
    queryParams.append("watchlistArtworkFields", artworkFields.join(","));
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/user/watchlist?${queryParams.toString()}`,
      {
        method: "GET",
        headers: headers(),
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to fetch user data",
      };
    }

    return { success: true, data: result.data as T };
  } catch (error) {
    console.error("Error fetching user artworks:", error);
    return { success: false, message: "Failed to fetch user artworks" };
  }
}

// type UserWatchlist = string[];

// export async function fetchUserWatchlist(
//   username: string
// ): Promise<ApiResponse<UserWatchlist>> {
//   if (!username) {
//     return { success: false, message: "Username not provided" };
//   }

//   const { watchlist } = await fetch(
//     `http://localhost:3000/api/user/watchlist?username=${encodeURIComponent(
//       username
//     )}`,
//     {
//       cache: "no-cache",
//       method: "GET",
//       headers: headers(),
//     }
//   ).then((res) => res.json());

//   if (!watchlist) {
//     return { success: false, message: "Watchlist not found" };
//   }

//   return { success: true, data: watchlist };
// }

// !V2
// export async function fetchUserWatchlist(): Promise<
//   ApiResponse<UserWatchlist>
// > {
//   const session = await getServerSession(authOptions);
//   const username = session?.user?.name;

//   if (!username) {
//     return { success: false, message: "User not found" };
//   }

//   const { watchlist } = await fetch(
//     "http://localhost:3000/api/user/watchlist",
//     {
//       cache: "no-cache",
//       method: "GET",
//       headers: headers(),
//     }
//   ).then((res) => {
//     return res.json();
//   });

//   if (!watchlist) {
//     return { success: false, message: "Watchlist not found" };
//   }

//   return { success: true, data: watchlist };
// }

// export async function getUserWatchlist() {
//   const session = await getServerSession(authOptions);
//   const username = session?.user?.name;

//   // if (!username) {
//   //   return NextResponse.json({ message: "User not found" });
//   // }

//   //? returns the user and the watchlist
//   const user = (await UserModel.findOne({ username })
//     .select("watchlist")
//     .lean()) as IUser | null;

//   const watchlist = user?.watchlist;

//   console.log("watchlistobject :>> ", watchlist);
//   if (!watchlist) {
//     return { message: "Watchlist not found" };
//   }
//   return watchlist;
//   // return NextResponse.json({ watchlist });
// }
