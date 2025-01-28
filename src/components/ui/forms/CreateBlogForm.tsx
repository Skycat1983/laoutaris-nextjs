"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/form";
import { Input } from "../shadcn/input";
import { Textarea } from "../shadcn/textarea";
import { Checkbox } from "../shadcn/checkbox";
import { Button } from "../shadcn/button";

const blogFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  subtitle: z.string().min(2, "Subtitle must be at least 2 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  text: z.string().min(50, "Blog text must be at least 50 characters"),
  tags: z.string().transform((str) => str.split(",").map((tag) => tag.trim())),
  featured: z.boolean().default(false),
});

export function CreateBlogForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof blogFormSchema>>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      summary: "",
      text: "",
      tags: [],
      featured: false,
    },
  });

  async function onSubmit(values: z.infer<typeof blogFormSchema>) {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/admin/blogs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          displayDate: new Date(),
          slug: values.title.toLowerCase().replace(/\s+/g, "-"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create blog");
      }

      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Error creating blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog subtitle" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a brief summary of the blog post"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This will appear in blog previews and cards
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blog Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your blog post here"
                  className="min-h-[300px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter tags separated by commas"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Example: art, painting, modern, abstract
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Featured</FormLabel>
                <FormDescription>
                  Mark this blog post as featured
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Blog"}
        </Button>
      </form>
    </Form>
  );
}
