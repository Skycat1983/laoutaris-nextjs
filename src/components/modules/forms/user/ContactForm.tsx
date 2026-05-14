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
// import { submitEnquiry } from "@/lib/server/enquiry/actions/submitEnquiry";

// TODO: redo this form with shadcn/ui

const ContactForm = () => {
  const { openModal } = useGlobalFeatures();

  // Initialize the form with React Hook Form and Zod resolver
  const form = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: EnquiryInput) {
    const formData: EnquiryInput = {
      name: values.name,
      email: values.email,
      subject: values.subject,
      message: values.message,
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

      form.reset();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      console.error("Submission error:", errorMessage);
      // Optionally, handle the error (e.g., show an error message to the user)
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

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
