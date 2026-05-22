"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/shadcn/textarea";
import { clientApi } from "@/lib/api/clientApi";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "@/components/elements/typography/ModalMessage";
import {
  enquirySchema,
  type EnquiryInput,
} from "@/lib/data/schemas/enquirySchema";
import ContactEnquiryPrivacyNotice from "./ContactEnquiryPrivacyNotice";
// import { submitEnquiry } from "@/lib/server/enquiry/actions/submitEnquiry";

// TODO: redo this form with shadcn/ui

interface ContactFormProps {
  productHandle?: string;
}

const getDefaultValues = (productHandle?: string): EnquiryInput => ({
  name: "",
  email: "",
  subject: productHandle ? `Product enquiry: ${productHandle}` : "",
  message: productHandle
    ? `I am interested in product ${productHandle}. Please send purchase details.`
    : "",
  ...(productHandle ? { productHandle } : {}),
});

const ContactForm = ({ productHandle }: ContactFormProps) => {
  const { openModal } = useGlobalFeatures();
  const defaultValues = React.useMemo(
    () => getDefaultValues(productHandle),
    [productHandle]
  );

  // Initialize the form with React Hook Form and Zod resolver
  const form = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues,
  });

  // Handle form submission
  async function onSubmit(values: EnquiryInput) {
    const formData: EnquiryInput = {
      name: values.name,
      email: values.email,
      subject: values.subject,
      message: values.message,
      ...(productHandle ? { productHandle } : {}),
    };

    try {
      const result = await clientApi.public.enquiry.create(formData);
      if (result.success) {
        openModal(
          <ModalMessage
            message="Enquiry submitted successfully"
            type="success"
          />
        );
      } else {
        openModal(
          <ModalMessage message="Enquiry submission failed" type="error" />
        );
      }

      form.reset(defaultValues);
    } catch {
      // Existing behavior intentionally leaves the user's draft in place when
      // the request fails before an API response is available.
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 px-4 py-6 bg-gray-100 rounded w-full"
      >
        {/* Name Field */}
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} className="w-full" />
              </FormControl>
              <FormDescription className="hidden">
                Your name is required.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Email Field */}
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormDescription className="hidden">
                We&apos;ll never share your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subject Field */}
        <FormField
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input
                  placeholder="Subject of your message"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormDescription className="hidden">
                The subject of your contact message.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message Field */}
        <FormField
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your message..."
                  {...field}
                  className="w-full resize-none h-32"
                />
              </FormControl>
              <FormDescription className="hidden">
                Enter the details of your message.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <ContactEnquiryPrivacyNotice />

        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
