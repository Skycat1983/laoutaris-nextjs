"use client";

import React, { useEffect, useState } from "react";
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
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { get } from "http";
import { RadioGroup, RadioGroupItem } from "../shadcn/radio-group";
import { Textarea } from "../textarea";

type Props = {
  //   getUsername: () => void;
  username: string | null;
};

// const getUsername = async () => {
//   "use server";
//   const session = await getServerSession(authOptions);
//   if (session?.user?.name) {
//     return session.user.name;
//   } else {
//     return null;
//   }
// };
// ! https://www.youtube.com/watch?v=gQ2bVQPFS4U
const EnquireForm = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<string | null>("");
  // TODO: get username from session.

  const formSchema = z.object({
    username: z.string().min(2, {
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
      username: "",
      email: "",
      enquiryType: "print",
      message: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  //! fields: username, email, message, radios (print, original, both), submit button
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 px-4 bg-slate-100"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription className="hidden">
                This is your public display name.
              </FormDescription>
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
              <FormDescription className="hidden">
                This is your public display name.
              </FormDescription>
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
                    <FormLabel className="font-normal">Either/both</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
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
                Any information you'd like to share with us about your enquiry.
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

export default EnquireForm;
