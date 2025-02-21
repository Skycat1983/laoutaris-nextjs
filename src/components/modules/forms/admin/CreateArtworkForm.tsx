"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Input } from "@/components/shadcn/input";
import { Checkbox } from "@/components/shadcn/checkbox";
import { ArtworkImage } from "@/lib/data/types/artworkTypes";
import Image from "next/image";
import { useState } from "react";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { CreateArtworkFormSchema } from "@/lib/data/schemas/formSchemas";
import { revalidatePath } from "next/cache";
import { BaseArtwork } from "@/lib/data/models";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";

interface CreateArtworkFormProps {
  uploadInfo: ArtworkImage | null;
  onSuccess: () => void;
}

export function CreateArtworkForm({
  uploadInfo,
  onSuccess,
}: CreateArtworkFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof CreateArtworkFormSchema>>({
    resolver: zodResolver(CreateArtworkFormSchema),
    defaultValues: {
      featured: false,
    },
  });

  async function onSubmit(values: z.infer<typeof CreateArtworkFormSchema>) {
    if (!uploadInfo) return;
    setIsSubmitting(true);

    try {
      const artworkData: BaseArtwork = {
        ...values,
        image: uploadInfo,
      };

      const response = await clientAdminApi.create.postArtwork(artworkData);

      console.log("response", response);
      // Revalidate the admin artwork page
      revalidatePath("/admin/artwork");
      onSuccess();
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
      form.reset({
        title: "",
        decade: undefined,
        artstyle: undefined,
        medium: undefined,
        surface: undefined,
        featured: false,
      });
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-500px)]">
      <div className="grid grid-cols-1  gap-12 w-full lg:grid-cols-2 p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter artwork title"
                      {...field}
                      disabled={isSubmitting || !uploadInfo}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="decade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting || !uploadInfo}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose the decade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        "1950s",
                        "1960s",
                        "1970s",
                        "1980s",
                        "1990s",
                        "2000s",
                        "2010s",
                        "2020s",
                      ].map((decade) => (
                        <SelectItem key={decade} value={decade}>
                          {decade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="artstyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Art Style</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting || !uploadInfo}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an art style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["abstract", "semi-abstract", "figurative"].map(
                        (style) => (
                          <SelectItem key={style} value={style}>
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medium</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting || !uploadInfo}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a medium" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        "oil",
                        "acrylic",
                        "paint",
                        "watercolour",
                        "pastel",
                        "pencil",
                        "charcoal",
                        "ink",
                        "sand",
                      ].map((medium) => (
                        <SelectItem key={medium} value={medium}>
                          {medium.charAt(0).toUpperCase() + medium.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="surface"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surface</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting || !uploadInfo}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a surface" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["paper", "canvas", "wood", "film"].map((surface) => (
                        <SelectItem key={surface} value={surface}>
                          {surface.charAt(0).toUpperCase() + surface.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting || !uploadInfo}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      Mark this artwork as featured
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting || !uploadInfo}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
        {uploadInfo ? (
          <Image
            src={uploadInfo.secure_url}
            alt="Uploaded artwork"
            width={uploadInfo.pixelWidth}
            height={uploadInfo.pixelHeight}
            className="object-contain w-full rounded-lg hidden lg:block"
          />
        ) : (
          <div className="w-[400px] h-[400px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hidden lg:block">
            <p className="text-gray-400">Image will appear here after upload</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
