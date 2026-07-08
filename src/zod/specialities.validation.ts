import z from "zod";

// স্পেশালিটি তৈরির জন্য Zod ভ্যালিডেশন স্কিমা
export const createSpecialityZodSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});
