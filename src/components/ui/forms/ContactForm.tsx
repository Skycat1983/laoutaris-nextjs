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
} from "../shadcn/form";
import { Button } from "../shadcn/button";
import { Input } from "../shadcn/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "../shadcn/textarea";
// import { submitEnquiry } from "@/lib/server/enquiry/actions/submitEnquiry";

// TODO: redo this form with shadcn/ui

const ContactForm = () => {
  // Define the schema for form validation using Zod
  const contactFormSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    subject: z.string().min(2, {
      message: "Subject must be at least 2 characters.",
    }),
    message: z.string().min(10, {
      message: "Message must be at least 10 characters.",
    }),
  });
  // Initialize the form with React Hook Form and Zod resolver
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: "",
      subject: "",
      message: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("subject", values.subject);
    formData.append("message", values.message);

    try {
      //   const result = await submitEnquiry(formData);
      //   console.log("Form submitted successfully:", result);
      // Optionally, reset the form or show a success message
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
