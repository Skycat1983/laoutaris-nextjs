import { SubscribeSection } from "@/components/sections";
import { ArtworkView } from "@/components/views";
import { serverApi } from "@/lib/api/serverApi";
import { ArtworkFrontend } from "@/lib/data/types";
import { ApiSuccessResponse } from "@/lib/data/types";
import { delay } from "@/lib/utils/debug";
import React from "react";

const ArtworkLoader = async ({ params }: { params: { id: string } }) => {
  await delay(1000);
  const result = await serverApi.public.artwork.single(params.id);
  if (!result.success) {
    throw new Error("Failed to fetch artwork");
  }
  const { data } = result as ApiSuccessResponse<ArtworkFrontend>;
  return (
    <>
      <div className="py-16">
        <ArtworkView {...data} />
      </div>
      {/* <CollectionInfoLayout /> */}
      <div className="pt-16">
        <SubscribeSection isLoggedIn={false} />
      </div>
    </>
  );
};

export default ArtworkLoader;
