export interface FrontendEnquiry {
  id: string;
  name: string;
  email: string;
  enquiryType: "print" | "original" | "both";
  message: string;
}
