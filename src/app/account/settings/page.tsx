import { UserSettingsLoader } from "@/components/loaders/componentLoaders/UserSettingsLoader";
import { Suspense } from "react";

export default async function UserSettings() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <UserSettingsLoader />
      </Suspense>
    </>
  );
}
