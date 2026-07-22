import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(1, "Full name is required").min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  image: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  role: z.enum(["user", "doctor"]),
  dob: z.string().optional(),
  bloodGroup: z.string().optional(),
  tos: z.boolean().refine((v) => v === true, "You must accept the Terms of Service to continue"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  category: z.string().min(1, "Please select a category"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactInput = z.infer<typeof ContactSchema>;

export const ProfileSchema = z.object({
  name: z.string().min(1, "Full name is required").min(2, "Name must be at least 2 characters"),
  dob: z.string().optional(),
  bloodGroup: z.string().optional(),
});

export type ProfileInput = z.infer<typeof ProfileSchema>;

export const MedicineSchema = z.object({
  name: z.string().min(1, "Medicine name is required"),
  genericName: z.string().optional(),
  manufacturer: z.string().optional(),
  category: z.string().optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  description: z.string().optional(),
  dosage: z.string().optional(),
  strength: z.string().optional(),
  stock: z.number().int().min(0, "Stock must be non-negative").optional(),
});

export type MedicineInput = z.infer<typeof MedicineSchema>;

export const BlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().max(500, "Excerpt must be under 500 characters").optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["Draft", "Published"]).optional(),
});

export type BlogInput = z.infer<typeof BlogSchema>;

export const ConditionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  severity: z.enum(["Low", "Moderate", "High", "Critical"]).optional(),
  symptoms: z.array(z.string()).optional(),
  precautions: z.array(z.string()).optional(),
});

export type ConditionInput = z.infer<typeof ConditionSchema>;

export const NewsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type NewsletterInput = z.infer<typeof NewsletterSchema>;
