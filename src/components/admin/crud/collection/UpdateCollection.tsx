"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { FrontendCollectionWithArtworks } from "@/lib/types/collectionTypes";
import { readCollection } from "@/lib/api/readApi";
import { UpdateCollectionForm } from "@/components/ui/forms/UpdateCollectionForm";

const readSchema = z.object({
  objectId: z.string().min(1, "Object ID is required"),
});

type ReadFormValues = z.infer<typeof readSchema>;

export const UpdateCollection = () => {
  const [collectionInfo, setCollectionInfo] =
    useState<FrontendCollectionWithArtworks | null>(null);

  const form = useForm<ReadFormValues>({
    resolver: zodResolver(readSchema),
    defaultValues: {
      objectId: "",
    },
  });

  async function onSubmit(formData: ReadFormValues) {
    try {
      // TODO: Implement readCollection function
      const collection: FrontendCollectionWithArtworks = await readCollection(
        formData.objectId
      );
      setCollectionInfo(collection);
    } catch (error) {
      console.error("Error in UpdateCollection:", error);
    }
  }

  const handleFormSuccess = () => {
    setCollectionInfo(null);
  };

  const label = collectionInfo
    ? "✓ Collection located"
    : "Please enter Collection ID to continue";

  return (
    <div className="flex flex-col items-around justify-start gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
      {!collectionInfo && (
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
                      <Input placeholder="Enter Collection ID" {...field} />
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
                {form.formState.isSubmitting ? "Reading..." : "Find Collection"}
              </Button>
            </form>
          </Form>
        </div>
      )}
      <div className="text-center text-gray-500">{label}</div>
      {collectionInfo && (
        <UpdateCollectionForm
          collectionInfo={collectionInfo}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};
