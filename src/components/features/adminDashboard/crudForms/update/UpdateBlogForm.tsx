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
import { BlogEntryFrontend } from "@/lib/data/types";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";
import { updateBlogFormSchema, UpdateBlogFormValues } from "@/lib/data/schemas";
import { DatePicker } from "@/components/modules/datePicker/DatePicker";

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
      // tags: blogInfo.tags,
    },
  });

  const handleImageUrlBlur = (url: string) => {
    setImagePreview(url);
  };

  async function onSubmit(data: UpdateBlogFormValues) {
    setIsSubmitting(true);
    try {
      const response = await clientAdminApi.update.patchBlog(
        blogInfo._id,
        data
      );

      if (response.success) {
        onSuccess?.();
      }
    } catch (error) {
      console.error("Error updating blog entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-100px)]">
      <div className="grid grid-cols-1 gap-12 w-full lg:grid-cols-2 p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (data) => {
                console.log("Validation successful, calling onSubmit");
                onSubmit(data);
              },
              (errors) => {
                console.error("Validation errors:", errors);
              }
            )}
            className="space-y-8"
          >
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
