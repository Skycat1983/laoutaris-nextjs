"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
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
import { ScrollArea } from "@/components/shadcn/scroll-area";
import type {
  ApiErrorResponse,
  ArtworkFrontend,
  CollectionFrontendPopulated,
} from "@/lib/data/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/tabs";
import {
  UpdateCollectionFormValues,
  updateCollectionSchema,
} from "@/lib/data/schemas/collectionSchema";
import { clientApi } from "@/lib/api/clientApi";
import { getContentImageUrlFeedback } from "../contentImageUrlFeedback";

type CollectionUpdateFieldName = keyof UpdateCollectionFormValues;

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
  "artworksToAdd",
] as const satisfies readonly CollectionUpdateFieldName[];

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

interface UpdateCollectionFormProps {
  collectionInfo: CollectionFrontendPopulated;
  onSuccess: () => void;
}

export const UpdateCollectionForm = ({
  collectionInfo,
  onSuccess,
}: UpdateCollectionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(collectionInfo.imageUrl);
  const [artworkRelationshipMessage, setArtworkRelationshipMessage] = useState(
    "No artwork relationship changes selected."
  );
  const [artworkRelationshipMessageType, setArtworkRelationshipMessageType] =
    useState<"neutral" | "success" | "error">("neutral");
  const [isLoadingArtwork, setIsLoadingArtwork] = useState(false);
  const artworkIdRef = useRef<HTMLInputElement>(null);

  // Track artwork changes
  const [artworks, setArtworks] = useState<ArtworkFrontend[]>(
    collectionInfo.artworks
  );
  const [artworksToAdd, setArtworksToAdd] = useState<string[]>([]);
  const [artworksToRemove, setArtworksToRemove] = useState<string[]>([]);

  const form = useForm<UpdateCollectionFormValues>({
    resolver: zodResolver(updateCollectionSchema),
    defaultValues: {
      title: collectionInfo.title,
      subtitle: collectionInfo.subtitle,
      summary: collectionInfo.summary,
      text: collectionInfo.text,
      imageUrl: collectionInfo.imageUrl,
      artworksToAdd: [],
      artworksToRemove: [],
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
        message: response.error || "Failed to update collection",
      });
    }
  };

  const handleRemoveArtwork = (artworkId: string) => {
    const artwork = artworks.find((item) => item._id === artworkId);
    const wasNewlyAdded = artworksToAdd.includes(artworkId);

    setArtworks((current) => current.filter((a) => a._id !== artworkId));
    setArtworksToRemove((current) =>
      wasNewlyAdded || current.includes(artworkId)
        ? current
        : [...current, artworkId]
    );
    // If this was a newly added artwork, remove it from artworksToAdd
    setArtworksToAdd((current) => current.filter((id) => id !== artworkId));
    setArtworkRelationshipMessage(
      wasNewlyAdded
        ? `Removed unsaved add for ${artwork?.title ?? "this artwork"}; no saved relationship change remains for that artwork.`
        : `Ready to remove ${artwork?.title ?? "this artwork"}. Save to apply this change.`
    );
    setArtworkRelationshipMessageType("neutral");
  };

  const handleAddArtwork = async () => {
    const artworkId = artworkIdRef.current?.value.trim();
    if (!artworkId) {
      setArtworkRelationshipMessage("Enter an artwork ID before adding.");
      setArtworkRelationshipMessageType("error");
      return;
    }

    const existingArtwork = artworks.find(
      (artwork) => artwork._id === artworkId
    );
    if (existingArtwork) {
      setArtworkRelationshipMessage(
        `${existingArtwork.title} is already in this collection; no changes were made.`
      );
      setArtworkRelationshipMessageType("error");
      return;
    }

    const removedArtwork = collectionInfo.artworks.find(
      (artwork) => artwork._id === artworkId
    );
    if (removedArtwork && artworksToRemove.includes(artworkId)) {
      setArtworks((current) => [...current, removedArtwork]);
      setArtworksToRemove((current) => current.filter((id) => id !== artworkId));
      setArtworkRelationshipMessage(
        `${removedArtwork.title} restored; no saved relationship change remains for that artwork.`
      );
      setArtworkRelationshipMessageType("neutral");
      if (artworkIdRef.current) artworkIdRef.current.value = "";
      return;
    }

    setIsLoadingArtwork(true);
    setArtworkRelationshipMessage(`Looking up artwork ${artworkId}...`);
    setArtworkRelationshipMessageType("neutral");
    try {
      const result = await clientApi.admin.read.artwork(artworkId);
      if (result.success) {
        const artwork = result.data;
        // Check if artwork is already in the collection
        if (artworks.some((a) => a._id === artwork._id)) {
          setArtworkRelationshipMessage(
            `${artwork.title} is already in this collection; no changes were made.`
          );
          setArtworkRelationshipMessageType("error");
          return;
        }
        setArtworks((current) => [...current, artwork]);
        setArtworksToAdd((current) =>
          current.includes(artwork._id) ? current : [...current, artwork._id]
        );
        setArtworksToRemove((current) =>
          current.filter((id) => id !== artwork._id)
        );
        setArtworkRelationshipMessage(
          `Ready to add ${artwork.title}. Save to apply this change.`
        );
        setArtworkRelationshipMessageType("success");
        if (artworkIdRef.current) artworkIdRef.current.value = "";
        return;
      }

      setArtworkRelationshipMessage(
        `Artwork not found for ID ${artworkId}. No artworks were added.`
      );
      setArtworkRelationshipMessageType("error");
    } catch {
      setArtworkRelationshipMessage(
        `Artwork lookup failed for ID ${artworkId}. No artworks were added.`
      );
      setArtworkRelationshipMessageType("error");
    } finally {
      setIsLoadingArtwork(false);
    }
  };

  async function onSubmit(data: UpdateCollectionFormValues) {
    form.clearErrors();
    setIsSubmitting(true);
    try {
      // Send both the form data and artwork changes
      const response = await clientApi.admin.update.patchCollection(
        collectionInfo._id,
        {
          ...data,
          artworksToAdd,
          artworksToRemove,
        }
      );

      if (!response.success) {
        applyApiErrors(response as CollectionFormErrorResponse);
        return;
      }

      onSuccess();
    } catch (error) {
      form.setError("root", {
        type: "server",
        message:
          error instanceof Error ? error.message : "Failed to update collection",
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

            {/* Artwork Management Section */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold">Associated Artworks</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Current Artworks: {artworks.length}
                </p>
                <div className="flex gap-2">
                  <Input
                    ref={artworkIdRef}
                    placeholder="Enter artwork ID to add"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddArtwork}
                    disabled={isLoadingArtwork}
                  >
                    {isLoadingArtwork ? "Loading..." : "Add Artwork"}
                  </Button>
                </div>
                <p
                  role={
                    artworkRelationshipMessageType === "error"
                      ? "alert"
                      : "status"
                  }
                  className={`text-sm ${
                    artworkRelationshipMessageType === "success"
                      ? "text-green-600"
                      : artworkRelationshipMessageType === "error"
                      ? "font-medium text-destructive"
                      : "text-gray-500"
                  }`}
                >
                  {artworkRelationshipMessage}
                </p>
                {form.formState.errors.artworksToAdd?.message && (
                  <p
                    role="alert"
                    className="text-sm font-medium text-destructive"
                  >
                    {form.formState.errors.artworksToAdd.message}
                  </p>
                )}
              </div>
            </div>

            {/* Regular form fields */}
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
                      placeholder="Enter collection summary"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
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
                      placeholder="Write collection content here"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Collection"}
            </Button>
          </form>
        </Form>

        {/* Updated Preview Section with Tabs */}
        <div className="space-y-4">
          <Tabs defaultValue="collection" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="collection">Collection Image</TabsTrigger>
              <TabsTrigger value="artworks">Artwork Images</TabsTrigger>
            </TabsList>

            <TabsContent value="collection">
              <h3 className="text-lg font-semibold mb-4">Collection Image</h3>
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Collection preview"
                  width={400}
                  height={400}
                  className="object-contain rounded-lg"
                />
              ) : (
                <div className="w-[400px] h-[400px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">
                    Image preview will appear here
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="artworks">
              <h3 className="text-lg font-semibold mb-4">
                Associated Artworks
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {artworks.map((artwork) => (
                  <div key={artwork._id} className="space-y-2">
                    <Image
                      src={artwork.image.secure_url}
                      alt={artwork.title}
                      width={200}
                      height={200}
                      className="object-contain rounded-lg"
                    />
                    <p className="text-sm font-medium truncate">
                      {artwork.title}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleRemoveArtwork(artwork._id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ScrollArea>
  );
};
