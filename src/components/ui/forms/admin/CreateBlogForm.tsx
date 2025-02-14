"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../shadcn/form";
import { Input } from "../../shadcn/input";
import { Textarea } from "../../shadcn/textarea";
import { Checkbox } from "../../shadcn/checkbox";
import { Button } from "../../shadcn/button";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import { DatePicker } from "../../datePicker/DatePicker";
import { CreateBlogFormSchema } from "@/lib/server/schemas/formSchemas";
import { handleBlogUpload } from "@/lib/server/blog/use_cases/handleBlogUpload";

export function CreateBlogForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // New state to keep track of the selected year for the date picker
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const form = useForm<z.infer<typeof CreateBlogFormSchema>>({
    resolver: zodResolver(CreateBlogFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      summary: "",
      text: "",
      imageUrl: "",
      featured: false,
      displayDate: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof CreateBlogFormSchema>) {
    try {
      setIsSubmitting(true);
      console.log("2. About to call handleBlogUpload");

      const response = await handleBlogUpload({
        formData: values,
      });

      console.log("3. Got response from handleBlogUpload:", response);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("4. Error in form submission:", error);
    } finally {
      console.log("5. Submission process completed");
      setIsSubmitting(false);
    }
  }

  const handleImageUrlBlur = (url: string) => {
    if (url && url.match(/^https?:\/\/.+/)) {
      setImagePreview(url);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-100px)]">
      <div className="grid grid-cols-1 gap-12 w-full lg:grid-cols-2 p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (data) => {
                console.log("Validation successful, calling onSubmit");
                onSubmit(data);
              },
              (errors) => {
                console.error("Validation errors:", errors);
              }
            )}
            className="space-y-8"
          >
            {/* Display Date Field with Year Dropdown */}
            <FormField
              control={form.control}
              name="displayDate"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Display Date</FormLabel>
                  <div className="flex flex-col space-y-2">
                    {/* DatePicker with defaultMonth based on selectedYear */}
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      defaultMonth={new Date(selectedYear, 0, 1)}
                    />
                    {/* Year Dropdown */}
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        const newYear = parseInt(e.target.value, 10);
                        setSelectedYear(newYear);
                        // Update the displayDate with the new year while keeping month and day
                        const currentDate = field.value || new Date();
                        const updatedDate = new Date(
                          newYear,
                          currentDate.getMonth(),
                          currentDate.getDate()
                        );
                        field.onChange(updatedDate);
                      }}
                      className="w-[280px] border p-2 rounded"
                    >
                      {Array.from(
                        { length: new Date().getFullYear() - 1900 + 1 },
                        (_, i) => 1900 + i
                      )
                        .reverse() // Show more recent years at the top
                        .map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                    </select>
                  </div>
                  <FormDescription>
                    When this blog post should be displayed as written
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      onBlur={(e) => {
                        field.onBlur();
                        handleImageUrlBlur(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    URL of the image to accompany the blog post
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
                    <Input placeholder="Enter blog title" {...field} />
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
                    <Input placeholder="Enter blog subtitle" {...field} />
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
                      placeholder="Enter a brief summary of the blog post"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will appear in blog previews and cards
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blog Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your blog post here"
                      className="min-h-[300px]"
                      {...field}
                    />
                  </FormControl>
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
                      Mark this blog post as featured
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => console.log("Button clicked")}
            >
              {isSubmitting ? "Creating..." : "Create Blog"}
            </Button>
          </form>
        </Form>

        {/* Image Preview Section */}
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Blog post image"
            width={400}
            height={400}
            className="object-contain w-full rounded-lg hidden lg:block"
          />
        ) : (
          <div className="w-[400px] h-[400px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hidden lg:block">
            <p className="text-gray-400">Image preview will appear here</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

// export function CreateBlogForm() {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   const form = useForm<z.infer<typeof CreateBlogFormSchema>>({
//     resolver: zodResolver(CreateBlogFormSchema),
//     defaultValues: {
//       title: "",
//       subtitle: "",
//       summary: "",
//       text: "",
//       imageUrl: "",
//       //   tags: "",
//       featured: false,
//       displayDate: new Date(),
//     },
//   });

//   async function onSubmit(values: z.infer<typeof CreateBlogFormSchema>) {
//     try {
//       setIsSubmitting(true);
//       console.log("2. About to call handleBlogUpload");

//       const response = await handleBlogUpload({
//         formData: values,
//       });

//       console.log("3. Got response from handleBlogUpload:", response);
//       form.reset();
//       router.refresh();
//     } catch (error) {
//       console.error("4. Error in form submission:", error);
//     } finally {
//       console.log("5. Submission process completed");
//       setIsSubmitting(false);
//     }
//   }

//   const handleImageUrlBlur = (url: string) => {
//     if (url && url.match(/^https?:\/\/.+/)) {
//       setImagePreview(url);
//     }
//   };

//   return (
//     <ScrollArea className="h-[calc(100vh-100px)]">
//       <div className="grid grid-cols-1  gap-12 w-full lg:grid-cols-2 p-4">
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(
//               (data) => {
//                 console.log("Validation successful, calling onSubmit");
//                 onSubmit(data);
//               },
//               (errors) => {
//                 console.error("Validation errors:", errors);
//               }
//             )}
//             className="space-y-8"
//           >
//             <FormField
//               control={form.control}
//               name="displayDate"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Display Date</FormLabel>
//                   <FormControl>
//                     <DatePicker date={field.value} setDate={field.onChange} />
//                   </FormControl>
//                   <FormDescription>
//                     When this blog post should be displayed as written
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="imageUrl"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Image URL</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Enter image URL"
//                       {...field}
//                       onBlur={(e) => {
//                         field.onBlur();
//                         handleImageUrlBlur(e.target.value);
//                       }}
//                     />
//                   </FormControl>
//                   <FormDescription>
//                     URL of the image to accompany the blog post
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Title</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter blog title" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="subtitle"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Subtitle</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter blog subtitle" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="summary"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Summary</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Enter a brief summary of the blog post"
//                       className="resize-none"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription>
//                     This will appear in blog previews and cards
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="text"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Blog Content</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Write your blog post here"
//                       className="min-h-[300px]"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="featured"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox
//                       checked={field.value}
//                       onCheckedChange={field.onChange}
//                     />
//                   </FormControl>
//                   <div className="space-y-1 leading-none">
//                     <FormLabel>Featured</FormLabel>
//                     <FormDescription>
//                       Mark this blog post as featured
//                     </FormDescription>
//                   </div>
//                 </FormItem>
//               )}
//             />

//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               onClick={() => console.log("Button clicked")}
//             >
//               {isSubmitting ? "Creating..." : "Create Blog"}
//             </Button>
//           </form>
//         </Form>

//         {/* Image Preview Section */}
//         {imagePreview ? (
//           <Image
//             src={imagePreview}
//             alt="Blog post image"
//             width={400}
//             height={400}
//             className="object-contain w-full rounded-lg hidden lg:block"
//           />
//         ) : (
//           <div className="w-[400px] h-[400px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hidden lg:block">
//             <p className="text-gray-400">Image preview will appear here</p>
//           </div>
//         )}
//       </div>
//     </ScrollArea>
//   );
// }
