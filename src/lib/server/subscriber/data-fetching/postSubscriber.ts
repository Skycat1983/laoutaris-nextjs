import { IFrontendSubscriber } from "@/lib/client/types/subscriberTypes";
import { headers } from "next/headers";

export async function postSubscriber(
  name: string,
  email: string
): Promise<ApiResponse<IFrontendSubscriber>> {
  const result = await fetch("http://localhost:3000/api/subscriber", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers(),
    },
    body: JSON.stringify({ name, email }),
  }).then((res) => res.json());

  if (!result || !result.success) {
    return { success: false, message: "Failed to create subscriber" };
  }

  return { success: true, data: result.data };
}
