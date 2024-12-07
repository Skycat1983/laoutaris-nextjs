import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import { authOptions } from "@/lib/config/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";

export default async function ProtectedRoute() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    // redirect("api/auth/signin");
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
}
