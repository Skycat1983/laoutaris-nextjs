import { SingleResult } from "@/lib/data/types";
import { Fetcher } from "../../core/createFetcher";
import { EnquiryBase } from "@/lib/data/models";
export type ApiEnquiryResult = SingleResult<{ success: true; message: string }>;

export const createEnquiryFetchers = (fetcher: Fetcher) => ({
  create: async (enquiry: EnquiryBase) => {
    return fetcher<ApiEnquiryResult>("/api/v2/public/enquiry", {
      method: "POST",
      body: JSON.stringify(enquiry),
    });
  },
});
