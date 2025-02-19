import PageLoading from "@/components/animations/PageLoading";
import { UserSettingsLoader } from "@/components/loaders/componentLoaders/UserSettingsLoader";
import { Suspense } from "react";

export default async function UserSettings() {
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <UserSettingsLoader />
      </Suspense>
    </>
  );
}
