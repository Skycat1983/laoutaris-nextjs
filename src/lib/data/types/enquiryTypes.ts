export interface Enquiry {
  id: string;
  name: string;
  email: string;
  enquiryType: "print" | "original" | "both";
  message: string;
}
