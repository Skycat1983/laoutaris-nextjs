import { useGlobalFeatures } from "@/lib/client/contexts/GlobalFeaturesContext";
import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";

export default async function ProtectedRoute() {
  const session = await getServerSession();

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
