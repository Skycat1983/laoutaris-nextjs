import UserCommentsLoader from "@/components/loaders/viewLoaders/UserCommentsLoader";
import { Suspense } from "react";

export default async function CommentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserCommentsLoader />
    </Suspense>
  );
}
