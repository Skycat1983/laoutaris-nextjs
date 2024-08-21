export interface IFrontendEnquiry {
  name: string;
  email: string;
  enquiryType: "print" | "original" | "both";
  message: string;
  // createdAt: string;
  // updatedAt: string;
}
