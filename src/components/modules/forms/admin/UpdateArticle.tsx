"use client";

import { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/shadcn/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { FrontendArticleWithArtworkAndAuthor } from "@/lib/data/types/articleTypes";
import { UpdateArticleForm } from "@/components/modules/forms/admin/UpdateArticleForm";
import { readArticle } from "../../../../../still useful/readApi";

const readSchema = z.object({
  objectId: z.string().min(1, "Object ID is required"),
});

type ReadFormValues = z.infer<typeof readSchema>;

export const UpdateArticle = () => {
  const [articleInfo, setArticleInfo] =
    useState<FrontendArticleWithArtworkAndAuthor | null>(null);
  const form = useForm<ReadFormValues>({
    resolver: zodResolver(readSchema),
    defaultValues: {
      objectId: "",
    },
  });

  async function onSubmit(formData: ReadFormValues) {
    // console.log("formData", formData);
    try {
      const article: FrontendArticleWithArtworkAndAuthor = await readArticle(
        formData.objectId
      );
      setArticleInfo(article);
    } catch (error) {
      console.error("Error in UpdateArticle:", error);
    }
  }

  const handleFormSuccess = () => {
    setArticleInfo(null);
  };

  const label = articleInfo
    ? "✓ Article located"
    : "Please enter Article ID to continue";

  return (
    <div className="flex flex-col items-around justify-start gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
      {!articleInfo && (
        <div className="p-4 space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="objectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Object ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Article ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="destructive"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Reading..." : "Find Article"}
              </Button>
            </form>
          </Form>
        </div>
      )}
      <div className="text-center text-gray-500">{label}</div>
      {articleInfo && (
        <UpdateArticleForm
          articleInfo={articleInfo}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};
