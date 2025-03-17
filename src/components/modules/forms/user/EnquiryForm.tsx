"use client";

//! unused but should be used

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
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";
import { Textarea } from "@/components/shadcn/textarea";
import { clientApi } from "@/lib/api/clientApi";
import { EnquiryBase } from "@/lib/data/models";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "@/components/elements/typography/ModalMessage";

// TODO: redo this form with shadcn/ui

// ! https://www.youtube.com/watch?v=gQ2bVQPFS4U

const EnquiryForm = ({ artworkId }: { artworkId: string }) => {
  const { openModal } = useGlobalFeatures();

  // TODO: get username from session.

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
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

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: artworkId,
      message: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // const formData = new FormData();
    // formData.append("name", values.name);
    // formData.append("email", values.email);
    // formData.append("subject", artworkId);
    // formData.append("message", values.message);
    const enquiry: EnquiryBase = {
      name: values.name,
      email: values.email,
      subject: artworkId, // Assuming artworkId is a string
      message: values.message,
    };

    try {
      const result = await clientApi.public.enquiry.create(enquiry);
      console.log("result of submit enquiry", result);
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      console.log(errorMessage);
    }
  }

  //! fields: username, email, message, radios (print, original, both), submit button
  return (
    <Form {...form}>
      <form
        // action={formAction}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 px-4 bg-slate-100"
      >
        <FormField
          // control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormDescription className="hidden">Your name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormDescription className="hidden">Your email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any information you'd like to share with us about your enquiry."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription className="hidden">
                Any information you&apos;d like to share with us about your
                enquiry.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default EnquiryForm;

//   const defaultValues = {
//   name: "",
//   email: "",
//   enquiryType: "print",
//   message: "",
// };

// const [state, formAction] = useFormState(submitEnquiry, initialState)
