"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormState } from "react-dom";
import {
  submitSubscription,
  type SubscribeFormState,
} from "@/lib/actions/submitSubscription";
import {
  NEWSLETTER_CONSENT_FIELD_VALUE,
  subscriptionFormSchema,
} from "@/lib/data/schemas/subscriberSchema";
import { SubmitButton } from "@/components/elements/buttons/SubmitButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

// TODO: this form does not reflect nor return the errors from submission as we do not make use of useFormState?
// TODO: add modal to show success message after submission
const SubscribeForm = () => {
  const pathname = usePathname();
  const initialState: SubscribeFormState = {
    success: false,
    message: "",
  };

  const [state, formAction] = useFormState(submitSubscription, initialState);

  const form = useForm<z.infer<typeof subscriptionFormSchema>>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      email: "",
      newsletterConsent: undefined,
      sourcePath: pathname || "/",
    },
  });

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="sourcePath" value={pathname || "/"} />
        <div className="flex gap-4 flex-col md:flex-row">
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
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            label="Subscribe"
            className={
              "px-6 py-6 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            }
            size={"sm"}
          />
        </div>
        <FormField
          name="newsletterConsent"
          control={form.control}
          render={({ field }) => (
            <FormItem className="space-y-2">
              <label className="flex items-start gap-3 text-sm leading-6 text-gray-200">
                <input
                  type="checkbox"
                  name={field.name}
                  value={NEWSLETTER_CONSENT_FIELD_VALUE}
                  checked={field.value === NEWSLETTER_CONSENT_FIELD_VALUE}
                  onChange={(event) =>
                    field.onChange(
                      event.target.checked
                        ? NEWSLETTER_CONSENT_FIELD_VALUE
                        : undefined
                    )
                  }
                  className="mt-1 h-4 w-4 rounded border-white/30 bg-white/10 text-white"
                />
                <span>
                  I agree to receive newsletter emails about Joseph Laoutaris
                  Art Archive updates and understand I can unsubscribe at any
                  time. See the{" "}
                  <Link className="underline" href="/privacy">
                    Privacy
                  </Link>{" "}
                  and{" "}
                  <Link className="underline" href="/terms">
                    Terms
                  </Link>
                  .
                </span>
              </label>
              <FormMessage />
            </FormItem>
          )}
        />
        {state?.message && (
          <p className={state.success ? "text-green-500" : "text-red-500"}>
            {state.message}
          </p>
        )}
      </form>
    </Form>
  );
};

export default SubscribeForm;
