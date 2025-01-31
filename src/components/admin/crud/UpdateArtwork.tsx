"use client";

import { useEffect, useState } from "react";
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
import { FrontendArtworkUnpopulated } from "@/lib/types/artworkTypes";
import { UpdateArtworkForm } from "@/components/ui/forms/UpdateArtworkForm";

const readSchema = z.object({
  objectId: z.string().min(1, "Object ID is required"),
});

type ReadFormValues = z.infer<typeof readSchema>;

export const UpdateArtwork = () => {
  const [artInfo, setArtInfo] = useState<FrontendArtworkUnpopulated | null>(
    null
  );
  const form = useForm<ReadFormValues>({
    resolver: zodResolver(readSchema),
    defaultValues: {
      objectId: "",
    },
  });

  // TODO: Where- if anywehre- could/should funcs like this be moved to?
  async function onSubmit(data: ReadFormValues) {
    try {
      const response = await fetch(
        `/api/artwork?identifierKey=_id&identifierValue=${encodeURIComponent(
          data.objectId
        )}&single=true`
      );

      console.log("response :>> ", response);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch artwork");
      }

      setArtInfo(result.data);
      console.log("Artwork read successfully:", result.data);
    } catch (error) {
      console.error("Error reading blog entry:", error);
    }
  }

  const label = artInfo
    ? "✓ Artwork located"
    : "Please enter Artwork ID to continue";

  return (
    <>
      {/* <div className="bg-red-100 flex flex-col items-around justify-start gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg"> */}
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
                      <Input placeholder="Enter Blog ID" {...field} />
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
                {form.formState.isSubmitting ? "Reading..." : "Find Blog"}
              </Button>
            </form>
          </Form>
        </div>
        // </div>
      )}
      <div className="text-center text-gray-500">{label}</div>
      {artInfo && <UpdateArtworkForm artworkInfo={artInfo} />}
      {/* </div> */}
    </>
  );
};
