"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Button } from "@/components/shadcn/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import {
  FrontendCollection,
  FrontendCollectionWithArtworks,
} from "@/lib/data/types/collectionTypes";
import { FrontendArtwork } from "@/lib/data/types/artworkTypes";
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
interface UpdateCollectionFormProps {
  collectionInfo: FrontendCollectionWithArtworks;
  onSuccess: () => void;
}

export const UpdateCollectionForm = ({
  collectionInfo,
  onSuccess,
}: UpdateCollectionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(collectionInfo.imageUrl);
  const [artworkToAdd, setArtworkToAdd] = useState<FrontendArtwork | null>(
    null
  );
  const [isLoadingArtwork, setIsLoadingArtwork] = useState(false);
  const artworkIdRef = useRef<HTMLInputElement>(null);

  // Track artwork changes
  const [artworks, setArtworks] = useState<FrontendArtwork[]>(
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
    },
  });

  const handleRemoveArtwork = (artworkId: string) => {
    setArtworks((current) => current.filter((a) => a._id !== artworkId));
    setArtworksToRemove((current) => [...current, artworkId]);
    // If this was a newly added artwork, remove it from artworksToAdd
    setArtworksToAdd((current) => current.filter((id) => id !== artworkId));
  };

  const handleAddArtwork = async () => {
    const artworkId = artworkIdRef.current?.value;
    if (!artworkId) return;

    setIsLoadingArtwork(true);
    try {
      const artwork = await clientApi.admin.read.artwork(artworkId);
      if (artwork.success) {
        // Check if artwork is already in the collection
        if (artworks.some((a) => a._id === artwork.data._id)) {
          // TODO: Show error message - artwork already exists
          return;
        }
        setArtworks((current) => [...current, artwork.data]);
        setArtworksToAdd((current) => [...current, artwork.data._id]);
        // If this artwork was previously removed, remove it from artworksToRemove
        setArtworksToRemove((current) =>
          current.filter((id) => id !== artwork.data._id)
        );
        setArtworkToAdd(null);
        if (artworkIdRef.current) artworkIdRef.current.value = "";
      } else {
        console.error("Error fetching artwork:", artwork.error);
      }
    } catch (error) {
      console.error("Error fetching artwork:", error);
    } finally {
      setIsLoadingArtwork(false);
    }
  };

  async function onSubmit(data: UpdateCollectionFormValues) {
    setIsSubmitting(true);
    try {
      // Send both the form data and artwork changes
      const updatedCollection = await clientApi.admin.update.patchCollection(
        collectionInfo._id,
        {
          ...data,
          artworksToAdd,
          artworksToRemove,
        }
      );

      console.log("Updated collection:", updatedCollection);
      onSuccess();
    } catch (error) {
      console.error("Error in UpdateCollectionForm:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-500px)]">
      <div className="grid grid-cols-1 gap-12 w-full lg:grid-cols-2 p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Artwork Management Section */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold">Associated Artworks</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Current Artworks: {collectionInfo.artworks.length}
                </p>
                {/* TODO: Add list of current artworks with remove buttons */}
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
                {artworkToAdd && (
                  <p className="text-sm text-green-600">
                    ✓ Ready to add: {artworkToAdd.title}
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
                        setImagePreview(e.target.value);
                      }}
                    />
                  </FormControl>
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
