"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/button";
import { FrontendArticle, Section } from "@/lib/types/articleTypes";
import { ScrollArea } from "../shadcn/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn/select";
import { Textarea } from "../shadcn/textarea";

const updateArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  text: z.string().min(50, "Article text must be at least 50 characters"),
  imageUrl: z.string().url("Invalid URL"),
  section: z.enum(["artwork", "biography", "project", "collections"] as const),
  overlayColour: z.enum(["white", "black"] as const),
});

type UpdateArticleFormValues = z.infer<typeof updateArticleSchema>;

interface UpdateArticleFormProps {
  articleInfo: FrontendArticle;
  onSuccess: () => void;
}

export const UpdateArticleForm = ({
  articleInfo,
  onSuccess,
}: UpdateArticleFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(articleInfo.imageUrl);

  const form = useForm<UpdateArticleFormValues>({
    resolver: zodResolver(updateArticleSchema),
    defaultValues: {
      title: articleInfo.title,
      subtitle: articleInfo.subtitle,
      summary: articleInfo.summary,
      text: articleInfo.text,
      imageUrl: articleInfo.imageUrl,
      section: articleInfo.section,
      overlayColour: articleInfo.overlayColour,
    },
  });

  const handleImageUrlBlur = (url: string) => {
    if (url && url.match(/^https?:\/\/.+/)) {
      setImagePreview(url);
    }
  };

  async function onSubmit(data: UpdateArticleFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/admin/article/update?_id=${articleInfo._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update article");
      }

      const result = await response.json();
      console.log("Article updated successfully:", result);
      onSuccess();
    } catch (error) {
      console.error("Error updating article:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-500px)]">
      <div className="grid grid-cols-1 gap-12 w-full lg:grid-cols-2 p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Form fields */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Add other form fields following the same pattern */}
            {/* ... */}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Article"}
            </Button>
          </form>
        </Form>

        {/* Image Preview */}
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Article preview"
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
};
