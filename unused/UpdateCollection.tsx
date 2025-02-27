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
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { FrontendCollectionWithArtworks } from "@/lib/data/types/collectionTypes";
import { UpdateCollectionForm } from "@/components/admin/crud/update/UpdateCollectionForm";
import { clientApi } from "@/lib/api/clientApi";

const readSchema = z.object({
  objectId: z.string().min(1, "Object ID is required"),
});

type ReadFormValues = z.infer<typeof readSchema>;

const UpdateCollection = () => {
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
      const collection = await clientApi.admin.read.collection(
        formData.objectId
      );
      if (collection.success) {
        setCollectionInfo(collection.data);
      } else {
        console.error("Error in UpdateCollection:", collection.error);
      }
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
