"use client";

import { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { FrontendArtwork } from "@/lib/types/artworkTypes";
import { CreateArticleForm } from "@/components/ui/forms/CreateArticleForm";

const readSchema = z.object({
  artworkId: z.string().min(1, "Artwork ID is required"),
});

type ReadFormValues = z.infer<typeof readSchema>;

export const CreateArticle = () => {
  const [artworkInfo, setArtworkInfo] = useState<FrontendArtwork | null>(null);
  const form = useForm<ReadFormValues>({
    resolver: zodResolver(readSchema),
    defaultValues: {
      artworkId: "",
    },
  });

  async function onSubmit(data: ReadFormValues) {
    try {
      const response = await fetch(
        `/api/v2/admin/artwork/read?_id=${encodeURIComponent(data.artworkId)}`
      );

      const result = await response.json();
      console.log("Artwork fetch result:", result);

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch artwork");
      }

      setArtworkInfo(result.data);
    } catch (error) {
      console.error("Error reading artwork:", error);
    }
  }

  const handleFormSuccess = () => {
    setArtworkInfo(null);
  };

  const label = artworkInfo
    ? "✓ Artwork located"
    : "Please enter Artwork ID to continue";

  return (
    <div className="flex flex-col items-around justify-start gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
      {!artworkInfo && (
        <div className="p-4 space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="artworkId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artwork ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Artwork ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Finding..." : "Find Artwork"}
              </Button>
            </form>
          </Form>
        </div>
      )}
      <div className="text-center text-gray-500">{label}</div>
      {artworkInfo && (
        <CreateArticleForm
          artworkInfo={artworkInfo}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};
