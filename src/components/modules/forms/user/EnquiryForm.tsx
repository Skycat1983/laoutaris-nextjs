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
} from "../../shadcn/form";
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "../../shadcn/radio-group";
import { Textarea } from "../../shadcn/textarea";
import { submitEnquiry } from "@/lib/server/enquiry/actions/submitEnquiry";

// TODO: redo this form with shadcn/ui

// ! https://www.youtube.com/watch?v=gQ2bVQPFS4U
const EnquiryForm = () => {
  // TODO: get username from session.

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    enquiryType: z.enum(["print", "original", "both"]),
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
      enquiryType: "print",
      message: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("enquiryType", values.enquiryType);
    formData.append("message", values.message);

    try {
      const result = await submitEnquiry(formData);
      console.log("result of submit enquiry", result);
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
          name="enquiryType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Enquiry type</FormLabel>
              <FormControl>
                {/* You can <span>@mention</span> other users and organizations. */}
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="original" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Original artwork
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="print" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Limited edition prints
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="both" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Either/both/other
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormDescription className="hidden">
                The type of enquiry you&apos;re making.
              </FormDescription>

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
                {/* You can <span>@mention</span> other users and organizations. */}
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
