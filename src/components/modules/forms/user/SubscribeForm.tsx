"use client";

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
import { useFormState } from "react-dom";
import {
  submitSubscription,
  type SubscribeFormState,
} from "@/lib/actions/submitSubscription";
import { subscriberSchema } from "@/lib/data/schemas/subscriberSchema";
import { SubmitButton } from "@/components/elements/buttons/SubmitButton";

// TODO: this form does not reflect nor return the errors from submission as we do not make use of useFormState?
// TODO: add modal to show success message after submission
const SubscribeForm = () => {
  const initialState: SubscribeFormState = {
    success: false,
    message: "",
  };

  const [state, formAction] = useFormState(submitSubscription, initialState);

  const form = useForm<z.infer<typeof subscriberSchema>>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form action={formAction} className="flex gap-4 flex-col md:flex-row">
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl className="w-full">
                <Input
                  placeholder="Enter your email"
                  {...field}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-6 text-white placeholder:text-gray-400 w-full"
                />
              </FormControl>
              <FormMessage>
                {state?.message && (
                  <span
                    className={
                      state.success ? "text-green-500" : "text-red-500"
                    }
                  >
                    {state.message}
                  </span>
                )}
              </FormMessage>
            </FormItem>
          )}
        />
        {/* <Button
          type="submit"
          className="px-6 py-6 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Subscribe
        </Button> */}
        <SubmitButton
          label="Subscribe"
          className={
            "px-6 py-6 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          }
          size={"sm"}
        />
      </form>
    </Form>
  );
};

export default SubscribeForm;
