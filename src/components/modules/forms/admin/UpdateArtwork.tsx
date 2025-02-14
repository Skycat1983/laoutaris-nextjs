"use client";

import { useEffect, useState } from "react";
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
import {
  FrontendArtwork,
  FrontendArtworkUnpopulated,
} from "@/lib/data/types/artworkTypes";
import { UpdateArtworkForm } from "@/components/modules/forms/admin/UpdateArtworkForm";
import { readArtwork } from "@/lib/api/admin/readApi";

const readSchema = z.object({
  objectId: z.string().min(1, "Object ID is required"),
});

type ReadFormValues = z.infer<typeof readSchema>;

export const UpdateArtwork = () => {
  const [artInfo, setArtInfo] = useState<FrontendArtwork | null>(null);
  const form = useForm<ReadFormValues>({
    resolver: zodResolver(readSchema),
    defaultValues: {
      objectId: "",
    },
  });

  async function onSubmit(data: ReadFormValues) {
    try {
      const result = await readArtwork(data.objectId);

      console.log("result", result);

      if (!result) {
        throw new Error("Failed to fetch artwork");
      }

      setArtInfo(result);
    } catch (error) {
      console.error("Error reading artwork entry:", error);
    }
  }

  const handleFormSuccess = () => {
    setArtInfo(null);
  };

  const label = artInfo
    ? "✓ Artwork located"
    : "Please enter Artwork ID to continue";

  return (
    <>
      <div className="bg-red-100 flex flex-col items-around justify-start gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
        {!artInfo && (
          // <div className="flex flex-row w-full justify-start">
          <div className="p-4 space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                // action={}
              >
                <FormField
                  control={form.control}
                  name="objectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Object ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Artwork ID" {...field} />
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
                  {form.formState.isSubmitting ? "Reading..." : "Find Artwork"}
                </Button>
              </form>
            </Form>
          </div>
          // </div>
        )}
        <div className="text-center text-gray-500">{label}</div>
        {artInfo && (
          <UpdateArtworkForm
            artworkInfo={artInfo}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </>
  );
};
