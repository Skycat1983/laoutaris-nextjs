"use client";

import { FrontendBlogEntryUnpopulated } from "@/lib/types/blogTypes";
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
import { UpdateBlogForm } from "@/components/ui/forms/UpdateBlogForm";

const readSchema = z.object({
  objectId: z.string().min(1, "Object ID is required"),
});

type ReadFormValues = z.infer<typeof readSchema>;

export const UpdateBlogEntry = () => {
  // const [blogId, setBlogId] = useState<string | null>(null);
  const [blogInfo, setBlogInfo] = useState<FrontendBlogEntryUnpopulated | null>(
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
    console.log("data :>> ", data);
    try {
      const url = `/api/blog/${encodeURIComponent(data.objectId)}`;
      const response = await fetch(url);

      console.log("response :>> ", response);
      const result = await response.json();
      console.log("result :>> ", result);

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch blog");
      }

      setBlogInfo(result.data);
      console.log("Blog entry read successfully:", result.data);
    } catch (error) {
      console.error("Error reading blog entry:", error);
    }
  }

  const label = blogInfo
    ? "✓ Blog Entry located"
    : "Please enter Blog Entry ID to continue";

  return (
    <>
      {/* <div className="bg-red-100 flex flex-col items-around justify-start gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg"> */}
      {!blogInfo && (
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
      {blogInfo && <UpdateBlogForm blogInfo={blogInfo} />}
      {/* </div> */}
    </>
  );
};
