"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/shadcn/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Input } from "@/components/ui/shadcn/input";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { CloudinaryUploadInfo } from "@/lib/types/cloudinaryTypes";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  decade: z.enum([
    "1950s",
    "1960s",
    "1970s",
    "1980s",
    "1990s",
    "2000s",
    "2010s",
    "2020s",
  ]),
  artstyle: z.enum(["abstract", "semi-abstract", "figurative"]),
  medium: z.enum([
    "oil",
    "acrylic",
    "paint",
    "watercolour",
    "pastel",
    "pencil",
    "charcoal",
    "ink",
    "sand",
  ]),
  surface: z.enum(["paper", "canvas", "wood", "film"]),
  featured: z.boolean().default(false),
});

interface CreateArtworkFormProps {
  uploadInfo: CloudinaryUploadInfo;
}

export function CreateArtworkForm({ uploadInfo }: CreateArtworkFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      featured: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Handle form submission
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Untitled" {...field} />
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
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a decade" />
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

          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div className="mx-auto">
        <Image
          src={uploadInfo.secure_url}
          alt="Uploaded artwork"
          width={uploadInfo.width}
          height={uploadInfo.height}
          className="object-contain rounded-lg"
        />
      </div>
    </div>
  );
}
