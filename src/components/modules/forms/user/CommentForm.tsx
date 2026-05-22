"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shadcn/button";
import { Textarea } from "@/components/shadcn/textarea";
import {
  createCommentSchema,
  type CreateCommentFormValues,
} from "@/lib/data/schemas/commentSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/shadcn/form";

interface CommentFormProps {
  blogSlug: string;
  onCommentSubmit: (comment: CreateCommentFormValues) => Promise<void>;
}

const CommentForm = ({ blogSlug, onCommentSubmit }: CommentFormProps) => {
  const form = useForm<CreateCommentFormValues>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      text: "",
      blogSlug,
      displayDate: new Date(),
    },
  });

  const handleSubmit = async (values: CreateCommentFormValues) => {
    try {
      await onCommentSubmit(values);
      form.reset(); // Clear form after successful submission
    } catch {
      // Keep the draft available for retry when the caller rejects.
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full max-w-2xl mx-auto mt-8"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Share your thoughts..."
                  className="min-h-[100px]"
                  aria-label="Comment text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="mt-4 text-sm leading-6 text-neutral-600">
          Comments you submit, along with your display name or username, may be
          shown publicly on this blog post. Please only post what you want
          public. Read the{" "}
          <Link className="underline underline-offset-4" href="/privacy">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link className="underline underline-offset-4" href="/terms">
            Terms of Use
          </Link>
          . For comment removal, correction, or moderation concerns, email{" "}
          <a
            className="underline underline-offset-4"
            href="mailto:hlaoutaris@gmail.com"
          >
            hlaoutaris@gmail.com
          </a>
          .
        </p>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full sm:w-auto mt-4"
        >
          {form.formState.isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </Form>
  );
};

export default CommentForm;
