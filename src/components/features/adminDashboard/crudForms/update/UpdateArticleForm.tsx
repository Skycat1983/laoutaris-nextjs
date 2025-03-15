"use client";

import { useState, useRef } from "react";
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
import { ArticleFrontendPopulated } from "@/lib/data/types";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";
import { ArtworkFrontend } from "@/lib/data/types";

import {
  UpdateArticleFormValues,
  updateArticleSchema,
} from "@/lib/data/schemas";
import { clientApi } from "@/lib/api/clientApi";
interface UpdateArticleFormProps {
  articleInfo: ArticleFrontendPopulated;
  onSuccess: () => void;
}

export const UpdateArticleForm = ({
  articleInfo,
  onSuccess,
}: UpdateArticleFormProps) => {
  console.log("articleInfo", articleInfo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(articleInfo.imageUrl);
  const [newArtwork, setNewArtwork] = useState<ArtworkFrontend | null>(null);
  const [isLoadingArtwork, setIsLoadingArtwork] = useState(false);
  const artworkIdRef = useRef<HTMLInputElement>(null);

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
      artwork: articleInfo.artwork._id,
    },
  });

  const handleFetchArtwork = async () => {
    const artworkId = artworkIdRef.current?.value;
    if (!artworkId) return;

    setIsLoadingArtwork(true);
    try {
      const result = await clientApi.admin.read.artwork(artworkId);
      if (result.success) {
        const artwork = result.data;

        setNewArtwork(artwork);
        setImagePreview(artwork.image.secure_url);
      } else {
        console.error("Error fetching artwork:", result.error);
      }
    } catch (error) {
      console.error("Error fetching artwork:", error);
    } finally {
      setIsLoadingArtwork(false);
    }
  };

  async function onSubmit(data: UpdateArticleFormValues) {
    setIsSubmitting(true);
    try {
      await clientApi.admin.update.patchArticle(articleInfo._id, {
        ...data,
        artwork: newArtwork?._id || articleInfo.artwork._id,
      });
      onSuccess();
    } catch (error) {
      console.error("Error in UpdateArticleForm:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-500px)]">
      <div className="grid grid-cols-1 gap-12 w-full lg:grid-cols-2 p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Artwork Selection Section */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold">Associated Artwork</h3>
              <p className="text-sm text-gray-500">
                Current Artwork: {articleInfo.artwork.title}
              </p>
              <div className="flex gap-2">
                <Input ref={artworkIdRef} placeholder="Enter new artwork ID" />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleFetchArtwork}
                  disabled={isLoadingArtwork}
                >
                  {isLoadingArtwork ? "Loading..." : "Fetch Artwork"}
                </Button>
              </div>
              {newArtwork && (
                <p className="text-sm text-green-600">
                  ✓ New Artwork Selected: {newArtwork.title}
                </p>
              )}
            </div>

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

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subtitle" {...field} />
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
              {isSubmitting ? "Updating..." : "Update Article"}
            </Button>
          </form>
        </Form>

        {/* Image Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {newArtwork ? "New Artwork Preview" : "Current Artwork"}
          </h3>
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
      </div>
    </ScrollArea>
  );
};
