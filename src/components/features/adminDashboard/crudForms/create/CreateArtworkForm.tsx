"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useState } from "react";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import {
  artworkFormSchema,
  ArtworkFormValues,
  CreateArtworkFormValues,
} from "@/lib/data/schemas";
import { clientApi } from "@/lib/api/clientApi";
import Image from "next/image";
import type { ApiErrorResponse, CloudinaryImageDB } from "@/lib/data/types";
import { Checkbox } from "@/components/shadcn/checkbox";
import { ShopifyProductLinksInput } from "@/components/features/adminDashboard/inputs/ShopifyProductLinksInput";
import {
  applyApiFormErrors,
  type StructuredFormErrorResponse,
} from "../formApiErrors";
import type { CreateArtworkResult } from "@/lib/api/admin/create/fetchers";

interface CreateArtworkFormProps {
  uploadInfo: CloudinaryImageDB | null;
  onSuccess: () => void;
}

const visibleArtworkFields = [
  "title",
  "decade",
  "artstyle",
  "medium",
  "surface",
  "featured",
  "shopifyProducts",
] as const;

export function CreateArtworkForm({
  uploadInfo,
  onSuccess,
}: CreateArtworkFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkFormSchema),
    defaultValues: {
      title: "",
      decade: "1950s",
      artstyle: "abstract",
      medium: "oil",
      surface: "canvas",
      featured: false,
      shopifyProducts: [],
    },
  });

  async function onSubmit(values: ArtworkFormValues) {
    if (!uploadInfo) return;
    form.clearErrors();
    setIsSubmitting(true);

    try {
      const artworkData: CreateArtworkFormValues = {
        ...values,
        image: uploadInfo,
      };

      const response: CreateArtworkResult | ApiErrorResponse =
        await clientApi.admin.create.artwork(artworkData);
      if (!response.success) {
        applyApiFormErrors({
          form,
          response: response as StructuredFormErrorResponse,
          visibleFields: visibleArtworkFields,
          fallbackMessage: "Failed to create artwork",
        });
        return;
      }

      onSuccess();

      // Revalidate the admin artwork page
      // revalidatePath("/admin/artwork");
    } catch (error) {
      form.setError("root", {
        type: "server",
        message:
          error instanceof Error ? error.message : "Failed to create artwork",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-500px)]">
      <div className="grid grid-cols-1  gap-12 w-full lg:grid-cols-2 p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {form.formState.errors.root?.message && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

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

            <ShopifyProductLinksInput
              control={form.control}
              register={form.register}
              errors={form.formState.errors.shopifyProducts}
              disabled={isSubmitting || !uploadInfo}
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
