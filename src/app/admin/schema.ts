import { z } from "zod";
import type { Post } from "@/lib/posts";

export const postSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
  slug: z
    .string()
    .trim()
    .min(3, "Slug required")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase-with-dashes only"),
  category: z.enum(["finance", "compsci"]),
  description: z.string().trim().min(10, "Add a short description").max(240),
  bannerImage: z.string().trim().url("Must be a valid URL"),
  content: z.string().refine((v) => v.replace(/<[^>]*>/g, "").trim().length >= 50, {
    message: "Write at least 50 characters of content",
  }),
});

export type PostFormValues = z.infer<typeof postSchema>;
export type FieldErrors = Partial<Record<keyof PostFormValues, string>>;

export const CATEGORY_OPTIONS: { value: Post["category"]; label: string }[] = [
  { value: "finance", label: "Finance" },
  { value: "compsci", label: "Computer Science" },
];

export const emptyForm: PostFormValues = {
  title: "",
  slug: "",
  category: "finance",
  description: "",
  bannerImage: "",
  content: "",
};

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");