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
import { FrontendArtwork } from "@/lib/types/artworkTypes";
import { Section } from "@/lib/types/articleTypes";
import { ScrollArea } from "../shadcn/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn/select";
import { Textarea } from "../shadcn/textarea";

const createArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  text: z.string().min(50, "Article text must be at least 50 characters"),
  imageUrl: z.string().url("Invalid URL"),
  section: z.enum(["artwork", "biography", "project", "collections"] as const),
  overlayColour: z.enum(["white", "black"] as const),
});

type CreateArticleFormValues = z.infer<typeof createArticleSchema>;

interface CreateArticleFormProps {
  artworkInfo: FrontendArtwork;
  onSuccess: () => void;
}

export const CreateArticleForm = ({
  artworkInfo,
  onSuccess,
}: CreateArticleFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateArticleFormValues>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      summary: "",
      text: "",
      imageUrl: artworkInfo.image.secure_url,
      section: "artwork",
      overlayColour: "white",
    },
  });

  async function onSubmit(data: CreateArticleFormValues) {
    setIsSubmitting(true);
    try {
      console.log("data", data);

      const response = await fetch("/api/v2/admin/article/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          artwork: artworkInfo._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create article");
      }

      const result = await response.json();
      console.log("Article created successfully:", result);
      onSuccess();
    } catch (error) {
      console.error("Error creating article:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-500px)]">
      <div className="grid grid-cols-1 gap-12 w-full lg:grid-cols-2 p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter article title" {...field} />
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
                    <Input placeholder="Enter article subtitle" {...field} />
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
                      placeholder="Enter article summary"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief overview of the article content
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
                  <FormLabel>Article Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your article content here"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a section" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="artwork">Artwork</SelectItem>
                      <SelectItem value="biography">Biography</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="collections">Collections</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The section this article belongs to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="overlayColour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overlay Colour</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select overlay colour" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Text overlay colour for the article header
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Article"}
            </Button>
          </form>
        </Form>

        {/* Artwork Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Selected Artwork</h3>
          <Image
            src={artworkInfo.image.secure_url}
            alt={artworkInfo.title}
            width={400}
            height={400}
            className="object-contain rounded-lg"
          />
          <p className="text-sm text-gray-500">
            Artwork Title: {artworkInfo.title}
          </p>
        </div>
      </div>
    </ScrollArea>
  );
};
