import { SingleResult } from "@/lib/data/types";
import { Fetcher } from "../../core/createFetcher";
import type { EnquiryInput } from "@/lib/data/schemas/enquirySchema";

export type ApiEnquiryResult = SingleResult<{ success: true; message: string }>;

export const createEnquiryFetchers = (fetcher: Fetcher) => ({
  create: async (enquiry: EnquiryInput) => {
    return fetcher<ApiEnquiryResult>("/api/v2/public/enquiry", {
      method: "POST",
      body: JSON.stringify(enquiry),
    });
  },
});
