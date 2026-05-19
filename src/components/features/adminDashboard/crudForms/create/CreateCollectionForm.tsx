"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/shadcn/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import Image from "next/image";
import { useState } from "react";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { useRouter } from "next/navigation";

import type { ApiErrorResponse } from "@/lib/data/types";
import {
  CreateCollectionFormValues,
  createCollectionSchema,
} from "@/lib/data/schemas/collectionSchema";
import { clientApi } from "@/lib/api/clientApi";
import type { CreateCollectionResult } from "@/lib/api/admin/create/fetchers";

type CollectionCreateFieldName = keyof CreateCollectionFormValues;

type CollectionFormErrorResponse = ApiErrorResponse & {
  fieldErrors?: Partial<Record<string, string[] | undefined>>;
  formErrors?: string[];
};

const visibleCollectionFields = [
  "imageUrl",
  "title",
  "subtitle",
  "summary",
  "text",
] as const satisfies readonly CollectionCreateFieldName[];

const isVisibleCollectionField = (
  field: string
): field is (typeof visibleCollectionFields)[number] =>
  visibleCollectionFields.includes(
    field as (typeof visibleCollectionFields)[number]
  );

const firstErrorMessage = (messages: unknown): string | null => {
  if (!Array.isArray(messages)) {
    return null;
  }

  return (
    messages.find(
      (message): message is string => typeof message === "string"
    ) ?? null
  );
};

export const CreateCollectionForm = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<CreateCollectionFormValues>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      summary: "",
      text: "",
      imageUrl: "",
    },
  });

  const handleImageUrlBlur = (url: string) => {
    if (url && url.match(/^https?:\/\/.+/)) {
      setImagePreview(url);
    }
  };

  const applyApiErrors = (response: CollectionFormErrorResponse) => {
    let appliedFieldError = false;
    const formMessages = response.formErrors?.filter(
      (message): message is string => typeof message === "string"
    ) ?? [];

    Object.entries(response.fieldErrors ?? {}).forEach(([field, messages]) => {
      const message = firstErrorMessage(messages);
      if (!message) {
        return;
      }

      if (isVisibleCollectionField(field)) {
        form.setError(field, { type: "server", message });
        appliedFieldError = true;
        return;
      }

      formMessages.push(message);
    });

    if (formMessages.length > 0) {
      form.setError("root", {
        type: "server",
        message: formMessages.join(" "),
      });
      return;
    }

    if (!appliedFieldError) {
      form.setError("root", {
        type: "server",
        message: response.error || "Failed to create collection",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof createCollectionSchema>) => {
    form.clearErrors();
    try {
      setIsSubmitting(true);
      const response: CreateCollectionResult | ApiErrorResponse =
        await clientApi.admin.create.collection(values);
      if (!response.success) {
        applyApiErrors(response as CollectionFormErrorResponse);
        return;
      }

      form.reset();
      router.refresh();
      onSuccess();
    } catch (error) {
      form.setError("root", {
        type: "server",
        message:
          error instanceof Error ? error.message : "Failed to create collection",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-100px)]">
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
                    URL of the image to represent this collection
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
                    <Input placeholder="Enter collection title" {...field} />
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
                    <Input placeholder="Enter collection subtitle" {...field} />
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
                      placeholder="Enter a brief summary"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A short description of the collection
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
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write the collection content here"
                      className="min-h-[300px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Collection"}
            </Button>
          </form>
        </Form>

        {/* Image Preview Section */}
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Collection preview"
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
