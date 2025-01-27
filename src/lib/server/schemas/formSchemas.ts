import { z } from "zod";

// Existing schemas
export const SignupFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(5),
});

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// New artwork schema
export const CreateArtworkFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  decade: z.enum(
    ["1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
    { required_error: "Please select a decade" }
  ),
  artstyle: z.enum(["abstract", "semi-abstract", "figurative"], {
    required_error: "Please select an art style",
  }),
  medium: z.enum(
    [
      "oil",
      "acrylic",
      "paint",
      "watercolour",
      "pastel",
      "pencil",
      "charcoal",
      "ink",
      "sand",
    ],
    { required_error: "Please select a medium" }
  ),
  surface: z.enum(["paper", "canvas", "wood", "film"], {
    required_error: "Please select a surface",
  }),
  featured: z.boolean().default(false),
});
