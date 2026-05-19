"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
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
import { Button } from "@/components/shadcn/button";
import type { ApiErrorResponse, ArtworkFrontend } from "@/lib/data/types";
import {
  createArticleSchema,
  CreateArticleFormValues,
} from "@/lib/data/schemas/articleSchema";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";
import { clientApi } from "@/lib/api/clientApi";
import {
  applyApiFormErrors,
  type StructuredFormErrorResponse,
} from "../formApiErrors";
import type { CreateArticleResult } from "@/lib/api/admin/create/fetchers";

interface CreateArticleFormProps {
  artworkInfo: ArtworkFrontend;
  onSuccess: () => void;
}

const visibleArticleCreateFields = [
  "title",
  "subtitle",
  "summary",
  "text",
  "section",
  "overlayColour",
  "artwork",
] as const;

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
      artwork: artworkInfo._id,
    },
  });

  async function onSubmit(data: CreateArticleFormValues) {
    form.clearErrors();
    setIsSubmitting(true);
    try {
      const response: CreateArticleResult | ApiErrorResponse =
        await clientApi.admin.create.article(data);

      if (!response.success) {
        applyApiFormErrors({
          form,
          response: response as StructuredFormErrorResponse,
          visibleFields: visibleArticleCreateFields,
          fallbackMessage: "Failed to create article",
        });
        return;
      }

      onSuccess();
    } catch (error) {
      form.setError("root", {
        type: "server",
        message:
          error instanceof Error ? error.message : "Failed to create article",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-500px)]">
      <div className="grid grid-cols-1 gap-12 w-full lg:grid-cols-2 p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {form.formState.errors.root?.message && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

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
          {form.formState.errors.artwork?.message && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {form.formState.errors.artwork.message}
            </p>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};
