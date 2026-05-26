"use client";

import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { Checkbox } from "@/components/shadcn/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import type { ApiErrorResponse, BlogEntryFrontend } from "@/lib/data/types";
import { clientApi } from "@/lib/api/clientApi";
import { updateBlogFormSchema, UpdateBlogFormValues } from "@/lib/data/schemas";
import { DatePicker } from "@/components/modules/datePicker/DatePicker";
import { BLOG_TAGS } from "@/lib/constants/blogConstants";
import {
  applyApiFormErrors,
  type StructuredFormErrorResponse,
} from "../formApiErrors";
import type { UpdateBlogResult } from "@/lib/api/admin/update/fetchers";
import { getContentImageUrlFeedback } from "../contentImageUrlFeedback";

const visibleBlogUpdateFields = [
  "displayDate",
  "imageUrl",
  "title",
  "subtitle",
  "summary",
  "text",
  "featured",
  "pinned",
  "tags",
] as const;

export const UpdateBlogForm = ({
  blogInfo,
  onSuccess,
}: {
  blogInfo: BlogEntryFrontend;
  onSuccess?: () => void;
}) => {
  const [imagePreview, setImagePreview] = useState(blogInfo.imageUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract the initial year from the blog's displayDate.
  const initialYear = new Date(blogInfo.displayDate).getFullYear();
  const [selectedYear, setSelectedYear] = useState(initialYear);

  const form = useForm<UpdateBlogFormValues>({
    resolver: zodResolver(updateBlogFormSchema),
    defaultValues: {
      displayDate: new Date(blogInfo.displayDate),
      imageUrl: blogInfo.imageUrl,
      title: blogInfo.title,
      subtitle: blogInfo.subtitle,
      summary: blogInfo.summary,
      text: blogInfo.text,
      featured: blogInfo.featured,
      pinned: blogInfo.pinned ?? false,
      tags: blogInfo.tags ?? [],
    },
  });

  const handleImageUrlChange = (url: string) => {
    const feedback = getContentImageUrlFeedback(url);

    if (feedback.status === "valid") {
      form.clearErrors("imageUrl");
      setImagePreview(feedback.previewUrl);
      return;
    }

    if (feedback.status === "invalid") {
      form.setError("imageUrl", {
        type: "validate",
        message: feedback.message,
      });
      return;
    }

    form.clearErrors("imageUrl");
  };

  async function onSubmit(data: UpdateBlogFormValues) {
    form.clearErrors();
    setIsSubmitting(true);
    try {
      const response: UpdateBlogResult | ApiErrorResponse =
        await clientApi.admin.update.patchBlog(blogInfo._id, data);

      if (!response.success) {
        applyApiFormErrors({
          form,
          response: response as StructuredFormErrorResponse,
          visibleFields: visibleBlogUpdateFields,
          fallbackMessage: "Failed to update blog",
        });
        return;
      }

      onSuccess?.();
    } catch (error) {
      form.setError("root", {
        type: "server",
        message: error instanceof Error ? error.message : "Failed to update blog",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-100px)]">
      <div className="grid grid-cols-1 gap-12 w-full lg:grid-cols-2 p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              onSubmit(data);
            })}
            className="space-y-8"
          >
            {form.formState.errors.root?.message && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            {/* Display Date Field with Year Dropdown */}
            <FormField
              control={form.control}
              name="displayDate"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Display Date</FormLabel>
                  <div className="flex flex-col space-y-2">
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                        defaultMonth={new Date(selectedYear, 0, 1)}
                      />
                    </FormControl>
                    {/* Year Dropdown */}
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        const newYear = parseInt(e.target.value, 10);
                        setSelectedYear(newYear);
                        // Update the displayDate while preserving the current month and day.
                        const currentDate = field.value || new Date();
                        const updatedDate = new Date(
                          newYear,
                          currentDate.getMonth(),
                          currentDate.getDate()
                        );
                        field.onChange(updatedDate);
                      }}
                      className="w-[280px] border p-2 rounded"
                    >
                      {Array.from(
                        { length: new Date().getFullYear() - 1900 + 1 },
                        (_, i) => 1900 + i
                      )
                        .reverse() // More recent years first.
                        .map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                    </select>
                  </div>
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
                      onChange={(e) => {
                        field.onChange(e);
                        handleImageUrlChange(e.target.value);
                      }}
                      onBlur={(e) => {
                        field.onBlur();
                        handleImageUrlChange(e.target.value);
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
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pinned"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Pinned</FormLabel>
                    <FormDescription>
                      Keep this blog post pinned in supported blog displays
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => {
                const selectedTags = field.value ?? [];

                return (
                  <FormItem>
                    <div
                      id="update-blog-tags-label"
                      className="text-sm font-medium"
                    >
                      Tags
                    </div>
                    <FormDescription>
                      Choose the blog taxonomy tags for this post
                    </FormDescription>
                    <div
                      role="group"
                      aria-labelledby="update-blog-tags-label"
                      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                      {BLOG_TAGS.map((tag) => (
                        <label
                          key={tag}
                          htmlFor={`update-blog-tag-${tag}`}
                          className="flex items-center gap-2 rounded-md border p-3 text-sm capitalize"
                        >
                          <Checkbox
                            id={`update-blog-tag-${tag}`}
                            checked={selectedTags.includes(tag)}
                            onCheckedChange={(checked) => {
                              if (checked === true) {
                                field.onChange([...selectedTags, tag]);
                                return;
                              }

                              field.onChange(
                                selectedTags.filter(
                                  (selectedTag) => selectedTag !== tag
                                )
                              );
                            }}
                          />
                          <span>{tag}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Blog"}
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
            className="object-contain w-full rounded-lg hidden lg:block"
          />
        ) : (
          <div className="w-[400px] h-[400px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hidden lg:block">
            <p className="text-gray-400">Image preview will appear here</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
