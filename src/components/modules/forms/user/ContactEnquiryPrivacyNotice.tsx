import Link from "next/link";

const ContactEnquiryPrivacyNotice = () => (
  <p className="text-sm leading-6 text-neutral-600">
    When you submit this enquiry, your name, email, subject, message, and any
    product or artwork context are used to respond to you and manage the manual
    enquiry record. Read the{" "}
    <Link className="underline underline-offset-4" href="/privacy">
      Privacy Policy
    </Link>{" "}
    and{" "}
    <Link className="underline underline-offset-4" href="/terms">
      Terms of Use
    </Link>
    . For privacy or legal questions, correction, or deletion requests, email{" "}
    <a
      className="underline underline-offset-4"
      href="mailto:hlaoutaris@gmail.com"
    >
      hlaoutaris@gmail.com
    </a>
    .
  </p>
);

export default ContactEnquiryPrivacyNotice;
