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
import Image from "next/image";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import { DatePicker } from "../shadcn/DatePicker";
import { CreateBlogFormSchema } from "@/lib/server/schemas/formSchemas";

// const blogFormSchema = z.object({
//   title: z.string().min(2, "Title must be at least 2 characters"),
//   subtitle: z.string().min(2, "Subtitle must be at least 2 characters"),
//   summary: z.string().min(10, "Summary must be at least 10 characters"),
//   text: z.string().min(50, "Blog text must be at least 50 characters"),
//   imageUrl: z.string().url("Please enter a valid URL"),
//   tags: z.string().transform((str) => str.split(",").map((tag) => tag.trim())),
//   featured: z.boolean().default(false),
//   displayDate: z.date({
//     required_error: "Please select a date",
//   }),
// });

export function CreateBlogForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof CreateBlogFormSchema>>({
    resolver: zodResolver(CreateBlogFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      summary: "",
      text: "",
      imageUrl: "",
      tags: [],
      featured: false,
      displayDate: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof CreateBlogFormSchema>) {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/admin/blog/create", {
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

      console.log("response in create blog form", response);

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

  const handleImageUrlBlur = (url: string) => {
    if (url && url.match(/^https?:\/\/.+/)) {
      setImagePreview(url);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-500px)]">
      <div className="grid grid-cols-2 gap-4 w-full p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="displayDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Date</FormLabel>
                  <FormControl>
                    <DatePicker date={field.value} setDate={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    When this blog post should be displayed as written
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter image URL"
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        handleImageUrlBlur(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    URL of the image to accompany the blog post
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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

        {/* Image Preview Section */}
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Blog post image"
            width={400}
            height={400}
            className="object-contain rounded-lg"
          />
        ) : (
          <div className="w-[400px] h-[400px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Image preview will appear here</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
